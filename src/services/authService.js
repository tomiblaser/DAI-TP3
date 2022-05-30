import 'dotenv/config'
import jwt from "jsonwebtoken";


export class AuthService {
    getToken = async () => {
      const getRandomString = () => {
          var result = "";
          var characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          var charactersLength = characters.length;
          for (var i = 0; i < 18; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
        
          return result;
        };
        
      const getSignedToken = () => {
        const userId = getRandomString();
        const userMail = `${userId}@example.com`;
        const token = jwt.sign(
          {
            payload: "EsteEsElPayload",
            userEmail: userMail,
          },
          process.env.AUTH_HS256_KEY,
          {
            issuer: "http://personajealantomi.ort/",
            subject: userId,
            audience: ["http://GarberBlaser.ort.sha/"],
            expiresIn: 60 * 24 * 24,
          }
        );
      
        return token;
      };
      
      return getSignedToken();
    
      console.log(getSignedToken());
    }
}