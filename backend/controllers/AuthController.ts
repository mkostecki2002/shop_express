import { Request, Response, Router } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";
import { StatusCodes } from "http-status-codes";
import { hash, compare } from "bcryptjs";
import { generateJwt, verifyRefresh, verifyAccess } from "../Authentication";
import { RefreshToken } from "../entity/RefreshToken";
import jwt from "jsonwebtoken";

const router = Router();
const userRepository = AppDataSource.getRepository(User);

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body as User;
  if (!username || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Username and password are required" });
  }
  try {
    const user = await userRepository.findOneBy({ username: String(username) });
    if (!user || (await compare(password, user.password)) === false) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }
    const token = generateJwt({ sub: user.id });
    res.setHeader("Authorization", `Bearer ${token}`);

    const refreshToken = generateJwt(
      { sub: user.id, role: user.role },
      "7d",
      "refresh",
    );

    const decoded = jwt.decode(refreshToken) as { exp: number; iat: number };

    const refreshTokenEntity = new RefreshToken();
    refreshTokenEntity.user = user;
    refreshTokenEntity.token = refreshToken;
    refreshTokenEntity.createdAt = new Date(decoded.iat * 1000);
    refreshTokenEntity.expiresAt = new Date(decoded.exp * 1000);

    AppDataSource.getRepository("RefreshToken").save(refreshTokenEntity);

    res.status(StatusCodes.OK).json({
      //Domyslnie 1h waznosci accessTokena
      accessToken: generateJwt({ sub: user.id, role: user.role }),
      refreshToken: refreshToken,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  const user = req.body as User;

  user.password = await hash(user.password, 10);
  if (!user.username || !user.password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Username and password are required" });
  }
  try {
    const emailRepeatedUser = await userRepository.findOneBy({
      email: user.email,
    });
    if (emailRepeatedUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User with given email already exists" });
    }
    const usernameRepeatedUser = await userRepository.findOneBy({
      username: user.username,
    });
    if (usernameRepeatedUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User with given username already exists" });
    }
    console.log("Registering user:", user);
    const savedUser = await userRepository.save(user);
    res.status(StatusCodes.CREATED).json(savedUser);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error", error });
  }
});

// Po wygaśnięciu access tokena, używa się refresh do wygenerowania nowego na bazie refresh tokena, ktory jest przechowywany w bazie danych
router.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No refresh token provided" });
  }

  try {
    const payload = verifyRefresh(refreshToken) as { sub: string };
    const userId = parseInt(payload.sub, 10);
    console.log("Refresh token valid for user ID:", userId);
    const user = await userRepository.findOneBy({ id: userId });
    if (!user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User not found" });
    const accessToken = generateJwt({ sub: user.id, role: user.role }, "1h");

    res.json({ accessToken: accessToken });
  } catch {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid refresh token" });
  }
});

// Usuniecie wszystkich refresh tokenow z bazy danych po wylogowaniu
// Wylogowanie ma na celu uniewaznic kazda aktywna sesje uzytkownika
router.post("/logout", verifyAccess, async (req: Request, res: Response) => {
  AppDataSource.getRepository("RefreshToken")
    .delete({ id: (req as any).user.sub })
    .catch(error => {
      console.error("Error deleting refresh tokens on logout:", error);
    });
  res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
});

export default router;
