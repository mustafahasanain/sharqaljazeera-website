import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  EmailSender,
  generateWelcomeEmail,
  generateEmailVerificationEmail,
  generatePasswordResetEmail,
  generatePasswordChangedEmail,
  generateAccountLockedEmail,
  generateTwoFactorCodeEmail,
  generateLoginNotificationEmail,
  getEmailSubject,
  type EmailConfig,
  type WelcomeEmailData,
  type EmailVerificationData,
  type PasswordResetEmailData,
  type PasswordChangedEmailData,
  type AccountLockedEmailData,
  type TwoFactorCodeEmailData,
  type LoginNotificationEmailData,
} from "@/lib/auth/email";

// Mock nodemailer
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-message-id" }),
      verify: vi.fn().mockResolvedValue(true),
    })),
  },
}));

describe("Auth Email", () => {
  const mockEmailConfig: EmailConfig = {
    host: "smtp.test.com",
    port: 587,
    secure: false,
    auth: {
      user: "test@example.com",
      pass: "password",
    },
    from: {
      name: "Test App",
      address: "noreply@test.com",
    },
  };

  describe("EmailSender", () => {
    let emailSender: EmailSender;

    beforeEach(() => {
      emailSender = new EmailSender(mockEmailConfig);
    });

    it("should create instance with correct config", () => {
      expect(emailSender).toBeInstanceOf(EmailSender);
    });

    it("should send email successfully", async () => {
      await expect(
        emailSender.send({
          to: "user@example.com",
          subject: "Test Email",
          html: "<p>Test</p>",
          text: "Test",
        })
      ).resolves.not.toThrow();
    });

    it("should verify transporter connection", async () => {
      const result = await emailSender.verify();
      expect(result).toBe(true);
    });
  });

  describe("Email Template Generators", () => {
    describe("generateWelcomeEmail", () => {
      it("should generate welcome email without verification URL", () => {
        const data: WelcomeEmailData = {
          firstName: "John",
        };

        const html = generateWelcomeEmail(data);

        expect(html).toContain("Welcome to Sharq Aljazeera!");
        expect(html).toContain("Hello John");
        expect(html).toContain("Thank you for joining");
        expect(html).not.toContain("Verify Email");
      });

      it("should generate welcome email with verification URL", () => {
        const data: WelcomeEmailData = {
          firstName: "Jane",
          verificationUrl: "https://example.com/verify?token=abc123",
        };

        const html = generateWelcomeEmail(data);

        expect(html).toContain("Welcome to Sharq Aljazeera!");
        expect(html).toContain("Hello Jane");
        expect(html).toContain("Verify Email");
        expect(html).toContain(data.verificationUrl);
      });

      it("should generate valid HTML", () => {
        const data: WelcomeEmailData = {
          firstName: "Test",
        };

        const html = generateWelcomeEmail(data);

        expect(html).toContain("<!DOCTYPE html>");
        expect(html).toContain("<html");
        expect(html).toContain("</html>");
      });
    });

    describe("generateEmailVerificationEmail", () => {
      it("should generate email verification email", () => {
        const data: EmailVerificationData = {
          firstName: "John",
          verificationUrl: "https://example.com/verify?token=abc123",
          expiresIn: "24 hours",
        };

        const html = generateEmailVerificationEmail(data);

        expect(html).toContain("Verify Your Email");
        expect(html).toContain("Hello John");
        expect(html).toContain(data.verificationUrl);
        expect(html).toContain("24 hours");
      });

      it("should include expiration warning", () => {
        const data: EmailVerificationData = {
          firstName: "Test",
          verificationUrl: "https://example.com/verify",
          expiresIn: "1 hour",
        };

        const html = generateEmailVerificationEmail(data);

        expect(html).toContain("will expire in 1 hour");
      });
    });

    describe("generatePasswordResetEmail", () => {
      it("should generate password reset email", () => {
        const data: PasswordResetEmailData = {
          firstName: "John",
          resetUrl: "https://example.com/reset?token=xyz789",
          expiresIn: "1 hour",
        };

        const html = generatePasswordResetEmail(data);

        expect(html).toContain("Reset Your Password");
        expect(html).toContain("Hello John");
        expect(html).toContain(data.resetUrl);
        expect(html).toContain("1 hour");
      });

      it("should include security message", () => {
        const data: PasswordResetEmailData = {
          firstName: "Test",
          resetUrl: "https://example.com/reset",
          expiresIn: "1 hour",
        };

        const html = generatePasswordResetEmail(data);

        expect(html).toContain("didn't request");
      });
    });

    describe("generatePasswordChangedEmail", () => {
      it("should generate password changed email", () => {
        const data: PasswordChangedEmailData = {
          firstName: "John",
          changedAt: "January 1, 2025 at 12:00 PM",
        };

        const html = generatePasswordChangedEmail(data);

        expect(html).toContain("Password Changed Successfully");
        expect(html).toContain("Hello John");
        expect(html).toContain(data.changedAt);
      });

      it("should include security alert", () => {
        const data: PasswordChangedEmailData = {
          firstName: "Test",
          changedAt: "January 1, 2025",
        };

        const html = generatePasswordChangedEmail(data);

        expect(html).toContain("didn't make this change");
        expect(html).toContain("contact our support");
      });
    });

    describe("generateAccountLockedEmail", () => {
      it("should generate account locked email without unlock URL", () => {
        const data: AccountLockedEmailData = {
          firstName: "John",
          reason: "Too many failed login attempts",
        };

        const html = generateAccountLockedEmail(data);

        expect(html).toContain("Account Locked");
        expect(html).toContain("Hello John");
        expect(html).toContain(data.reason);
        expect(html).not.toContain("Unlock Account");
      });

      it("should generate account locked email with unlock URL", () => {
        const data: AccountLockedEmailData = {
          firstName: "Jane",
          reason: "Suspicious activity detected",
          unlockUrl: "https://example.com/unlock?token=unlock123",
        };

        const html = generateAccountLockedEmail(data);

        expect(html).toContain("Account Locked");
        expect(html).toContain("Hello Jane");
        expect(html).toContain(data.reason);
        expect(html).toContain("Unlock Account");
        expect(html).toContain(data.unlockUrl);
      });
    });

    describe("generateTwoFactorCodeEmail", () => {
      it("should generate two-factor code email", () => {
        const data: TwoFactorCodeEmailData = {
          firstName: "John",
          code: "123456",
          expiresIn: "5 minutes",
        };

        const html = generateTwoFactorCodeEmail(data);

        expect(html).toContain("Your Verification Code");
        expect(html).toContain("Hello John");
        expect(html).toContain("123456");
        expect(html).toContain("5 minutes");
      });

      it("should style the code prominently", () => {
        const data: TwoFactorCodeEmailData = {
          firstName: "Test",
          code: "987654",
          expiresIn: "10 minutes",
        };

        const html = generateTwoFactorCodeEmail(data);

        expect(html).toContain("987654");
        expect(html).toContain("font-size: 32px");
      });
    });

    describe("generateLoginNotificationEmail", () => {
      it("should generate login notification email with full details", () => {
        const data: LoginNotificationEmailData = {
          firstName: "John",
          location: "New York, USA",
          device: "Chrome on Windows",
          timestamp: "January 1, 2025 at 12:00 PM",
        };

        const html = generateLoginNotificationEmail(data);

        expect(html).toContain("New Login Detected");
        expect(html).toContain("Hello John");
        expect(html).toContain(data.location);
        expect(html).toContain(data.device);
        expect(html).toContain(data.timestamp);
      });

      it("should generate login notification email without optional details", () => {
        const data: LoginNotificationEmailData = {
          firstName: "Test",
          timestamp: "January 1, 2025",
        };

        const html = generateLoginNotificationEmail(data);

        expect(html).toContain("New Login Detected");
        expect(html).toContain("Hello Test");
        expect(html).toContain(data.timestamp);
      });
    });
  });

  describe("getEmailSubject", () => {
    it("should return correct subject for welcome email", () => {
      expect(getEmailSubject("welcome")).toBe("Welcome to Sharq Aljazeera!");
    });

    it("should return correct subject for email verification", () => {
      expect(getEmailSubject("email_verification")).toBe(
        "Verify Your Email Address"
      );
    });

    it("should return correct subject for password reset", () => {
      expect(getEmailSubject("password_reset")).toBe("Reset Your Password");
    });

    it("should return correct subject for password changed", () => {
      expect(getEmailSubject("password_changed")).toBe(
        "Password Changed Successfully"
      );
    });

    it("should return correct subject for account locked", () => {
      expect(getEmailSubject("account_locked")).toBe(
        "Your Account Has Been Locked"
      );
    });

    it("should return correct subject for two-factor code", () => {
      expect(getEmailSubject("two_factor_code")).toBe(
        "Your Verification Code"
      );
    });

    it("should return correct subject for login notification", () => {
      expect(getEmailSubject("login_notification")).toBe(
        "New Login Detected"
      );
    });

    it("should return default subject for unknown type", () => {
      expect(getEmailSubject("unknown" as any)).toBe(
        "Notification from Sharq Aljazeera"
      );
    });
  });
});
