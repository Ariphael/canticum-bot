import { Client } from "discord.js";

export const getClientMock = () => 
  (({
    user: {
      tag: String,
    }, 
    application: {
      commands: {
        set: jest.fn(),
      }
    },
    once: jest.fn(),
  } as unknown) as Client);

export const getClientUserNullMock = () => 
  (({
    user: null, 
    application: {
      commands: {
        set: jest.fn(),
      }
    },
    once: jest.fn(),
  } as unknown) as Client);

export const getClientApplicationNullMock = () =>
  (({
    user: {
      tag: String,
    }, 
    application: null,
    once: jest.fn(),
  } as unknown) as Client)

export const getClientUserApplicationNullMock = () =>
  (({
    user: null, 
    application: null,
    once: jest.fn(),
  } as unknown) as Client);


