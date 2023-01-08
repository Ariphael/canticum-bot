import { Client } from "discord.js";

export const getClientMock = () => 
  (({
    login: jest.fn(),
    on: jest.fn(),
    once: jest.fn()
  } as unknown) as Client);