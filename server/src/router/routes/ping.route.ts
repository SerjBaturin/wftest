import { Request, Response } from "express";
import { axios, phpUrl } from "@/utils/api";
import { secret } from "@config/secret";

const ping = async (req: Request, res: Response) => {
  const request = axios(req);
  try {
    let pingResponse = await request.get(phpUrl, {
      params: {
        action: "ping",
      },
    });

    if (!pingResponse.data) {
      throw {
        error: new Error(`Error: ${pingResponse.statusText}`),
        status: pingResponse.status,
      };
    }

    if (!Reflect.has(req.cookies, "est_session")) {
      res.cookie("est_session", req.cookies.estSession, {
        sameSite: "none",
        secure: true,
      });
    }

    res.cookie("token", secret).send(pingResponse.data);
  } catch ({ error = "Error: Server error", status = 500 }) {
    res.status(status || 500).send(error?.message || "Server error");
  }
};

export default ping;
