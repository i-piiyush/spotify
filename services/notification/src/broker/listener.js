import { sendEmail } from "../utils/email.js";
import { subscribeToQueue } from "./rabbit.js";

export const startListener = () => {
  subscribeToQueue("user_created", async (msg) => {
    const { email, fullname, role } = msg;

    const template = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #000000; padding: 60px 20px; min-height: 100vh;">
  <div style="max-width: 480px; margin: 0 auto; background: #111111; border-radius: 24px; padding: 50px 40px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.08); position: relative;">
    
    <!-- Premium Top Accent -->
    <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #1DB954 0%, #1ed760 50%, #1DB954 100%); border-radius: 24px 24px 0 0;"></div>
    
    <!-- Logo -->
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); border-radius: 20px; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.05);">
        <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(29, 185, 84, 0.4);">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M8 5v14l11-7z" fill="white"/>
          </svg>
        </div>
      </div>
      <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px;">Welcome, ${fullname}</h1>
      <p style="color: #1DB954; font-size: 16px; font-weight: 500; margin: 0; letter-spacing: 1px;">Decibel</p>
    </div>

    <!-- Role Badge -->
    <div style="text-align: center; margin-bottom: 35px;">
      <span style="background: linear-gradient(135deg, rgba(29, 185, 84, 0.15) 0%, rgba(30, 215, 96, 0.1) 100%); color: #1DB954; padding: 10px 24px; border-radius: 12px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; border: 1px solid rgba(29, 185, 84, 0.2);">
        ${role}
      </span>
    </div>

    <!-- Content Card -->
    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #151515 100%); border-radius: 18px; padding: 35px 30px; margin: 30px 0; border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);">
      <p style="font-size: 17px; line-height: 1.7; color: #e5e5e7; margin: 0 0 20px 0; text-align: center; font-weight: 400;">
        We're thrilled to welcome you to our premium music community. Your journey to discovering exceptional sound begins now.
      </p>
      <p style="font-size: 17px; line-height: 1.7; color: #e5e5e7; margin: 0; text-align: center; font-weight: 400;">
        Access millions of tracks, create personalized playlists, and experience music like never before.
      </p>
    </div>

    <!-- CTA Button -->
    <div style="text-align: center; margin: 40px 0 35px 0;">
      <a href="https://sastaspotify.com/login" 
         style="background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%); color: #000000; text-decoration: none; padding: 18px 40px; border-radius: 14px; font-weight: 700; font-size: 17px; display: inline-block; box-shadow: 0 8px 25px rgba(29, 185, 84, 0.4), 0 2px 8px rgba(29, 185, 84, 0.3); transition: all 0.3s ease; letter-spacing: 0.3px; min-width: 200px;">
         <span style="display: inline-block; transform: translateY(0px);">Start Your Journey</span>
      </a>
    </div>

    <!-- Premium Features -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 35px 0 40px 0;">
      <div style="text-align: center; padding: 20px 15px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.03);">
        <div style="color: #1DB954; font-size: 24px; margin-bottom: 8px;">🎧</div>
        <div style="color: #ffffff; font-size: 13px; font-weight: 600;">High Quality Audio</div>
      </div>
      <div style="text-align: center; padding: 20px 15px; background: rgba(255, 255, 255, 0.02); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.03);">
        <div style="color: #1DB954; font-size: 24px; margin-bottom: 8px;">📱</div>
        <div style="color: #ffffff; font-size: 13px; font-weight: 600;">Multi-Device Sync</div>
      </div>
    </div>

    <!-- Footer -->
    <div style="border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 30px;">
      <p style="font-size: 13px; color: #8e8e93; text-align: center; margin: 0 0 8px 0; line-height: 1.5; font-weight: 400;">
        If you didn't sign up for Decibel, please disregard this email.
      </p>
      <p style="font-size: 11px; color: #636366; text-align: center; margin: 0; letter-spacing: 0.3px;">
        © 2024 Decibel Premium. All rights reserved.
      </p>
    </div>
  </div>
</div>
  
  `;

    await sendEmail(
      email,
      "welcome to Decibel",
      "welcome to Decibel",
      template
    );
  });
};


