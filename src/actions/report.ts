"use server";

import db from "@/lib/db";
import { Resend } from "resend";

type ReportRequest = {
  firstName: string;
  lastName: string;
  email: string;
  vnNumber: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handleReportRequest(data: ReportRequest) {
  try {
    const { firstName, lastName, email, vnNumber } = data;

    // Validate required fields
    if (!firstName || !lastName || !email || !vnNumber) {
      throw new Error("Required fields are missing");
    }

    // Save to database
    const report = await db.report.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        vinNumber: vnNumber,
      },
    });

    console.log("Start sending email");

    const fullName = `${firstName} ${lastName}`;

    const { error: emailError } = await resend.emails.send({
      from: process.env.RESEND_EMAIL  || "Car Inspection <noreply@TrueKinspection.com>",
      to: process.env.OWNER_EMAIL || "contact@TrueKinspection.com",
      subject: `Get Car Inspection Report - TrueK`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); background-color: #f8f9fa;">
          <h2 style="background-color: #d32f2f; color: #fff; padding: 15px; text-align: center; margin: 0; border-top-left-radius: 8px; border-top-right-radius: 8px;">
            📄 TrueK Car Inspection Report
          </h2>
          <div style="padding: 20px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #555;">
              Hello <strong>${fullName}</strong>,<br><br>
              We have received your request to retrieve your TrueK Car Inspection Report. Below are your request details:
            </p>
            <table style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; color: #333;">
              <tr>
                <td style="padding: 10px; background-color: #d32f2f; font-weight: bold; color: #fff;">Name:</td>
                <td style="padding: 10px;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #d32f2f; font-weight: bold; color: #fff;">Email:</td>
                <td style="padding: 10px;"><a href="mailto:${email}" style="color: #d32f2f; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; background-color: #d32f2f; font-weight: bold; color: #fff;">VIN Number:</td>
                <td style="padding: 10px;">${vnNumber || "N/A"}</td>
              </tr>
            </table>
            <p style="margin-top: 20px; font-size: 16px; color: #555;">
              Our team will process your request and email you the **inspection report** shortly. If you need any further assistance, feel free to reach out.
            </p>
            <p style="font-size: 16px; color: #555;">
              For urgent inquiries, contact us at <a href="mailto:contact@TrueKinspection.com" style="color: #d32f2f; text-decoration: none;">contact@TrueKinspection.com</a>.
            </p>
          </div>
          <footer style="background-color: #424242; padding: 10px; text-align: center; font-size: 12px; color: #fff; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
            <strong>TrueK Car Inspection</strong> | Ensuring Quality, One Car at a Time
          </footer>
        </div>
        `,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      throw emailError;
    }

    console.log("email sent");

    return { success: true, data: report };
  } catch (error) {
    console.error("Error processing report request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
}
