const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const prisma = require("./prisma");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) {
          return done(null, false, {
            message: "Incorrect email or password.",
          });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, {
            message: "Incorrect email or password.",
          });
        }

        if (!user.isVerified) {
          return done(null, false, {
            message: "Please verify your email to log in.",
          });
        }

        return done(null, user); // send the user back to passport.authenticate()
      } catch (error) {
        return done(error);
      }
    }
  )
);
