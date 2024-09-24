# Discord Profanity Bot

This project is a Discord bot designed to monitor and manage user behavior by detecting offensive language and applying punishments based on the number of offenses. The bot tracks offenses per user across different servers, ensuring that users are held accountable for their actions within each server individually.

## Features

- **Profanity Detection:** The bot listens for messages in the server, checks them against a profanity detection API, and takes appropriate actions based on the user's offense history.
- **Punishment System:** The bot automatically mutes or bans users based on the number of offenses:
  - 1st offense: 5-minute mute
  - 2nd offense: 15-minute mute
  - 3rd offense: Permanent ban
- **Persistent Offense Tracking:** Offenses are tracked per user per server, ensuring users don't carry offenses between servers.
- **Slash Command:** Includes a `/clear` command to clear a user's offenses for a specific server.
- **Hosted on AWS Elastic Beanstalk:** The bot is deployed and managed using AWS Elastic Beanstalk, ensuring scalability and reliability.

## Commands

### `/clear`
- **Description:** Clears a user's offenses on the server.
- **Permission:** Requires the `MuteMembers` permission.
- **Usage:** `/clear user: @username`

## Technical Details

- **Database:** Uses PostgreSQL via `knex.js` to manage user and server data, and to track offenses.
- **Discord.js:** Utilizes the `discord.js` library for interacting with the Discord API.
- **API Integration:** Integrates with a profanity detection API to identify offensive content in messages.
