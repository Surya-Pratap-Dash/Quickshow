import { Inngest } from "inngest";
import { Op } from "sequelize";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import Movie from "../models/Movie.js";
import { sendEmail } from "../config/nodeMailer.js";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      console.log("🔔 [Inngest] Received clerk/user.created event");
      console.log("📦 Event data:", JSON.stringify(event.data, null, 2));

      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;
      
      if (!id || !email_addresses || email_addresses.length === 0) {
        console.error("❌ [Inngest] Missing required user data:", { id, email_addresses });
        throw new Error("Missing required user data from Clerk");
      }

      const userData = {
        id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        image: image_url,
      };
      
      console.log("💾 [Inngest] Creating user with data:", userData);
      const createdUser = await User.create(userData);
      console.log("✅ [Inngest] User created successfully:", createdUser.toJSON());
      
      return { success: true, userId: createdUser.id };
    } catch (error) {
      console.error("❌ [Inngest] Error creating user:", error.message);
      console.error("📋 Error details:", error);
      throw error; // Re-throw so Inngest knows it failed
    }
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      console.log("🔔 [Inngest] Received clerk/user.deleted event");
      const { id } = event.data;
      console.log("🗑️  [Inngest] Deleting user:", id);
      const result = await User.destroy({ where: { id } });
      console.log("✅ [Inngest] User deleted successfully. Rows affected:", result);
      return { success: true, deletedCount: result };
    } catch (error) {
      console.error("❌ [Inngest] Error deleting user:", error.message);
      throw error;
    }
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      console.log("🔔 [Inngest] Received clerk/user.updated event");
      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;
      const userData = {
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        image: image_url,
      };
      console.log("✏️  [Inngest] Updating user:", id);
      const [updatedCount] = await User.update(userData, { where: { id } });
      console.log("✅ [Inngest] User updated successfully. Rows affected:", updatedCount);
      return { success: true, updatedCount };
    } catch (error) {
      console.error("❌ [Inngest] Error updating user:", error.message);
      throw error;
    }
  }
);

const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-delete-booking" },
  { event: "app/checkpayment" },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);

    await step.run("check-payment-status", async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findByPk(bookingId);

      if (!booking || booking.isPaid) {
        return;
      }

      const show = await Show.findByPk(booking.showId);
      if (show) {
        booking.bookedSeats.forEach((seat) => {
          delete show.occupiedSeats[seat];
        });
        await show.save();
      }

      await Booking.destroy({ where: { id: booking.id } });
    });
  }
);

const sendBookingConfirmationEmail = inngest.createFunction(
  { id: "send-booking-confirmation-email" },
  { event: "app/show.booked" },
  async ({ event }) => {
    const { bookingId } = event.data;
    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Show,
          as: "show",
          include: [{ model: Movie, as: "movie" }],
        },
        { model: User, as: "user" },
      ],
    });

    if (!booking || !booking.user || !booking.show || !booking.show.movie) {
      return;
    }

    await sendEmail({
      to: booking.user.email,
      subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
      body: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hi ${booking.user.name},</h2>
        <p>Your booking for <strong style="color: #F84565;">"${
          booking.show.movie.title
        }"</strong> is confirmed.</p>
        <p>
          <strong>Date:</strong> ${new Date(
            booking.show.showDateTime
          ).toLocaleDateString("en-US", { timeZone: "Africa/Kigali" })}<br />
          <strong>Time:</strong> ${new Date(
            booking.show.showDateTime
          ).toLocaleTimeString("en-US", { timeZone: "Africa/Kigali" })}
        </p>
        <p>Enjoy the show! 🍿</p>
        <p>Thanks for booking with us!<br />- QuickShow Team</P>
      </div>`,
    });
  }
);

const sendShowReminders = inngest.createFunction(
  { id: "send-show-reminders" },
  { cron: "0 */8 * * *" },
  async ({ step }) => {
    const now = new Date();
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

    const reminderTasks = await step.run("prepare-reminder-tasks", async () => {
      const shows = await Show.findAll({
        where: {
          showDateTime: { [Op.gte]: windowStart, [Op.lte]: in8Hours },
        },
        include: [{ model: Movie, as: "movie" }],
      });

      const tasks = [];

      for (const show of shows) {
        if (!show.movie || !show.occupiedSeats) continue;

        const userIds = [...new Set(Object.values(show.occupiedSeats || {}))];
        if (userIds.length === 0) continue;

        const users = await User.findAll({
          where: { id: userIds },
          attributes: ["name", "email"],
        });

        for (const user of users) {
          tasks.push({
            userEmail: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showTime: show.showDateTime,
          });
        }
      }

      return tasks;
    });

    if (reminderTasks.length === 0) {
      return { sent: 0, message: "No reminders to send." };
    }

    const results = await step.run("send-all-reminders", async () => {
      return await Promise.allSettled(
        reminderTasks.map((task) =>
          sendEmail({
            to: task.userEmail,
            subject: `Reminder: Your movie "${task.movieTitle}" starts soon!`,
            body: `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hello ${task.userName},</h2>
        <p>This is a quick reminder that your movie:</p>
        <h3 style="color: #F84565;">"${task.movieTitle}"</h3>
        <p>
          is scheduled for <strong>${new Date(task.showTime).toLocaleDateString(
            "en-US",
            { timeZone: "Africa/Kigali" }
          )}</strong> at
          <strong>${new Date(task.showTime).toLocaleTimeString("en-US", {
            timeZone: "Africa/Kigali",
          })}</strong>.
        </p>
        <p>It starts in approximately <strong>8 hours</strong> - make sure you're ready!</p>
        <br />
        <p>Enjoy the show! 🍿 - QuickShow Team</p>
      </div>`,
          })
        )
      );
    });

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - sent;

    return {
      sent,
      failed,
      message: `Sent ${sent} reminder(s), ${failed} failed.`,
    };
  }
);

const sendNewShowNotifications = inngest.createFunction(
  { id: "send-new-show-notifications" },
  { event: "app/show.added" },
  async ({ event }) => {
    const { movieTitle } = event.data;

    const users = await User.findAll();

    for (const user of users) {
      const userEmail = user.email;
      const userName = user.name;

      const subject = `🎬 New Show Added: ${movieTitle}`;
      const body = `<div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hi ${userName},</h2>
        <p>We've just added a new show to our library:</p>
        <h3 style="color: #F84565;">"${movieTitle}"</h3>
        <p>Visit our website - <a href="https://quickshow-sigma-roan.vercel.app/">QuickShow</a> 🔗</p>
        <br />
        <p>Thanks, <br />QuickShow Team</p>
      </div>`;

      await sendEmail({
        to: userEmail,
        subject,
        body,
      });
    }

    return { message: "Notifications sent." };
  }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
  sendShowReminders,
  sendNewShowNotifications,
];
