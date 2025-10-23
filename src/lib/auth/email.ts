import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { EmailConfig } from "./config";

// Re-export EmailConfig for use in tests and other modules
export type { EmailConfig } from "./config";

// Email template types
export type EmailTemplateType =
  | "welcome"
  | "email_verification"
  | "password_reset"
  | "password_changed"
  | "account_locked"
  | "two_factor_code"
  | "login_notification";

// Email data for templates
export type WelcomeEmailData = {
  readonly firstName: string;
  readonly verificationUrl?: string;
};

export type EmailVerificationData = {
  readonly firstName: string;
  readonly verificationUrl: string;
  readonly expiresIn: string;
};

export type PasswordResetEmailData = {
  readonly firstName: string;
  readonly resetUrl: string;
  readonly expiresIn: string;
};

export type PasswordChangedEmailData = {
  readonly firstName: string;
  readonly changedAt: string;
};

export type AccountLockedEmailData = {
  readonly firstName: string;
  readonly reason: string;
  readonly unlockUrl?: string;
};

export type TwoFactorCodeEmailData = {
  readonly firstName: string;
  readonly code: string;
  readonly expiresIn: string;
};

export type LoginNotificationEmailData = {
  readonly firstName: string;
  readonly location?: string;
  readonly device?: string;
  readonly timestamp: string;
};

// Union type for all email data
export type EmailTemplateData =
  | WelcomeEmailData
  | EmailVerificationData
  | PasswordResetEmailData
  | PasswordChangedEmailData
  | AccountLockedEmailData
  | TwoFactorCodeEmailData
  | LoginNotificationEmailData;

// Email send options
export type SendEmailOptions = {
  readonly to: string;
  readonly subject: string;
  readonly html: string;
  readonly text?: string;
};

// Email sender class
export class EmailSender {
  private transporter: Transporter;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  // Send email
  async send(options: SendEmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${this.config.from.name}" <${this.config.from.address}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
    } catch (error) {
      throw new Error(
        `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  // Verify transporter connection
  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }
}

// Email template generator functions
export const generateWelcomeEmail = (data: WelcomeEmailData): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Sharq Aljazeera</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Welcome to Sharq Aljazeera!</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hello ${data.firstName},</p>
        <p style="font-size: 16px;">Thank you for joining Sharq Aljazeera! We're excited to have you as part of our community.</p>
        ${
          data.verificationUrl
            ? `
        <p style="font-size: 16px;">To get started, please verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Email</a>
        </div>
        `
            : ""
        }
        <p style="font-size: 16px;">Start exploring our collection of quality products and enjoy a seamless shopping experience.</p>
        <p style="font-size: 16px;">Best regards,<br>The Sharq Aljazeera Team</p>
      </div>
    </body>
    </html>
  `;
};

export const generateEmailVerificationEmail = (
  data: EmailVerificationData
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #667eea; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Verify Your Email</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hello ${data.firstName},</p>
        <p style="font-size: 16px;">Please verify your email address to activate your account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Email</a>
        </div>
        <p style="font-size: 14px; color: #666;">This link will expire in ${data.expiresIn}.</p>
        <p style="font-size: 14px; color: #666;">If you didn't create an account, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;
};

export const generatePasswordResetEmail = (
  data: PasswordResetEmailData
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f59e0b; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Reset Your Password</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hello ${data.firstName},</p>
        <p style="font-size: 16px;">We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
        </div>
        <p style="font-size: 14px; color: #666;">This link will expire in ${data.expiresIn}.</p>
        <p style="font-size: 14px; color: #666;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      </div>
    </body>
    </html>
  `;
};

export const generatePasswordChangedEmail = (
  data: PasswordChangedEmailData
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Changed</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #10b981; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Password Changed Successfully</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hello ${data.firstName},</p>
        <p style="font-size: 16px;">Your password was successfully changed on ${data.changedAt}.</p>
        <p style="font-size: 16px;">If you didn't make this change, please contact our support team immediately.</p>
        <p style="font-size: 16px;">Best regards,<br>The Sharq Aljazeera Team</p>
      </div>
    </body>
    </html>
  `;
};

export const generateAccountLockedEmail = (
  data: AccountLockedEmailData
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Locked</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #ef4444; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Account Locked</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hello ${data.firstName},</p>
        <p style="font-size: 16px;">Your account has been temporarily locked. Reason: ${data.reason}</p>
        ${
          data.unlockUrl
            ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.unlockUrl}" style="background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Unlock Account</a>
        </div>
        `
            : ""
        }
        <p style="font-size: 16px;">If you believe this was a mistake, please contact our support team.</p>
      </div>
    </body>
    </html>
  `;
};

export const generateTwoFactorCodeEmail = (
  data: TwoFactorCodeEmailData
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Verification Code</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #8b5cf6; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Your Verification Code</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hello ${data.firstName},</p>
        <p style="font-size: 16px;">Your verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="background: white; border: 2px solid #8b5cf6; padding: 20px; border-radius: 5px; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #8b5cf6;">${data.code}</span>
          </div>
        </div>
        <p style="font-size: 14px; color: #666;">This code will expire in ${data.expiresIn}.</p>
        <p style="font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;
};

export const generateLoginNotificationEmail = (
  data: LoginNotificationEmailData
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Login Detected</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #3b82f6; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">New Login Detected</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px;">Hello ${data.firstName},</p>
        <p style="font-size: 16px;">We detected a new login to your account:</p>
        <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Time:</strong> ${data.timestamp}</p>
          ${data.location ? `<p style="margin: 5px 0;"><strong>Location:</strong> ${data.location}</p>` : ""}
          ${data.device ? `<p style="margin: 5px 0;"><strong>Device:</strong> ${data.device}</p>` : ""}
        </div>
        <p style="font-size: 16px;">If this was you, you can safely ignore this email. If you don't recognize this activity, please secure your account immediately.</p>
      </div>
    </body>
    </html>
  `;
};

// Helper function to get email subject
export const getEmailSubject = (type: EmailTemplateType): string => {
  switch (type) {
    case "welcome":
      return "Welcome to Sharq Aljazeera!";
    case "email_verification":
      return "Verify Your Email Address";
    case "password_reset":
      return "Reset Your Password";
    case "password_changed":
      return "Password Changed Successfully";
    case "account_locked":
      return "Your Account Has Been Locked";
    case "two_factor_code":
      return "Your Verification Code";
    case "login_notification":
      return "New Login Detected";
    default:
      return "Notification from Sharq Aljazeera";
  }
};
