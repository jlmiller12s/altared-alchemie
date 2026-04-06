# How to Build Your First MCP Server
### A Step-by-Step Guide for Complete Beginners

---

## Before We Start — What Even Is an MCP Server?

Think of an MCP server like a **translator between an AI and your tools**.

Normally, an AI like ChatGPT can only talk. It can't actually *do* anything in the real world — it can't look up your data, create a task, or check your calendar.

An MCP server changes that. It's a small program that sits in the middle and says:

> "Hey AI — here are the things you're allowed to do. Here's how to ask for them. I'll handle the rest."

Once you build an MCP server, the AI can use it like a set of hands. You tell it what to do in plain English, and it figures out which tool to use and how to use it.

**Real example:** You say *"Find all my overdue tasks"* — the AI calls your MCP server — the server asks your project management tool — the results come back — the AI gives you a summary. You didn't click anything.

That's what we're building today.

---

## What You'll Build

A simple MCP server with one tool: **get_weather**

It takes a city name and returns the current weather. Simple enough to learn the pattern, real enough to actually be useful.

Once you understand the pattern, you can swap "weather" for anything — Workfront tasks, emails, calendar events, whatever.

---

## What You Need Before Starting

You'll install everything in this guide. Here's what we're going to use:

- **Node.js** — the engine that runs our server (like a car engine — you don't need to understand it, just install it)
- **A terminal** — a text window where you type commands (don't worry, we'll explain every command)
- **A text editor** — to write code (we'll use VS Code, which is free)

**Time needed:** About 45–60 minutes the first time.

---

## Part 1: Install Your Tools

### Step 1 — Install Node.js

Node.js is the engine that will run your MCP server.

1. Go to: **https://nodejs.org**
2. Click the big green button that says **"LTS"** (this means "stable version")
3. Download it and run the installer
4. Click Next → Next → Install (all default settings are fine)

**How to check it worked:**
- On **Windows**: Press the Windows key, type `PowerShell`, open it
- On **Mac**: Press `Cmd + Space`, type `Terminal`, open it

Type this exactly and press Enter:
```
node --version
```

You should see something like `v22.0.0` — any number is fine. If you see a number, Node.js is installed. ✅

---

### Step 2 — Install VS Code (your code editor)

1. Go to: **https://code.visualstudio.com**
2. Download and install it (all defaults are fine)

VS Code is where you'll write your code. Think of it like Microsoft Word, but for code.

---

## Part 2: Create Your Project

### Step 3 — Create a folder for your project

Think of this as creating a new folder on your desktop to keep all your project files organized.

**On Windows (PowerShell):**
```
mkdir my-mcp-server
cd my-mcp-server
```

**On Mac (Terminal):**
```
mkdir my-mcp-server
cd my-mcp-server
```

What these commands do:
- `mkdir my-mcp-server` → **m**a**k**e **dir**ectory (creates a new folder called "my-mcp-server")
- `cd my-mcp-server` → **c**hange **d**irectory (moves you into that folder, like double-clicking it)

You'll see your terminal prompt change to show you're now inside that folder.

---

### Step 4 — Open the folder in VS Code

Type this in your terminal:
```
code .
```

The `.` means "this current folder." VS Code will open and show your (empty) project folder on the left side.

---

### Step 5 — Start a new Node.js project

Back in your terminal, type:
```
npm init -y
```

What this does: Creates a `package.json` file — think of it as your project's ID card. It tracks the name of your project and what tools it uses.

The `-y` means "yes to everything" so it doesn't ask you a bunch of questions.

You should see a message saying the file was created. ✅

---

### Step 6 — Install the MCP toolkit

Type this in your terminal:
```
npm install @modelcontextprotocol/sdk
```

This downloads the official MCP toolkit — the building blocks you need to create your server. It's like buying a box of LEGO before you build something.

This might take 30–60 seconds. You'll see a progress bar. When it finishes, you'll have a new folder called `node_modules` — that's where all the downloaded tools live. You don't need to touch that folder.

---

### Step 7 — Tell the project to use modern JavaScript

Open `package.json` in VS Code (click it in the left sidebar). It looks like this:

```json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  ...
}
```

Add one line: `"type": "module"` — like this:

```json
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "type": "module",
  ...
}
```

Save the file (`Ctrl+S` on Windows, `Cmd+S` on Mac).

---

## Part 3: Write Your MCP Server

### Step 8 — Create your server file

In VS Code, click the **New File** icon in the left sidebar (it looks like a page with a + sign), or right-click in the file list and choose "New File."

Name it: `index.js`

Now you'll write the actual server code. Copy and paste everything below into `index.js`:

```javascript
// ── Import the MCP toolkit ────────────────────────────────────────────────────
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// ── Create the server ─────────────────────────────────────────────────────────
// Think of this like opening up a shop and putting a sign on the door
const server = new Server(
  { name: "my-first-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// ── Define your tools ─────────────────────────────────────────────────────────
// This is the menu of things your server can do
// The AI reads this menu to know what to ask for
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_weather",
        description: "Get the current weather for a city. Use this when someone asks about weather or temperature.",
        inputSchema: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "The name of the city (e.g. 'Denver' or 'New York')"
            }
          },
          required: ["city"]
        }
      }
    ]
  };
});

// ── Handle tool calls ─────────────────────────────────────────────────────────
// This is what actually happens when the AI calls one of your tools
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_weather") {
    const city = args.city;

    // Fetch weather from a free API (no key needed)
    const url = `https://wttr.in/${encodeURIComponent(city)}?format=3`;
    const response = await fetch(url);
    const weatherText = await response.text();

    return {
      content: [{ type: "text", text: weatherText }]
    };
  }

  // If someone asks for a tool that doesn't exist
  return {
    content: [{ type: "text", text: `Unknown tool: ${name}` }],
    isError: true
  };
});

// ── Start the server ──────────────────────────────────────────────────────────
// This turns the lights on and opens for business
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("✅ MCP server is running!");
```

Save the file.

---

### Step 9 — Run your server

In your terminal, type:
```
node index.js
```

You should see:
```
✅ MCP server is running!
```

**Your MCP server is alive.** 🎉

Press `Ctrl+C` to stop it (you'll need to stop it before connecting it to an AI client).

---

## Part 4: Connect It to an AI

Now that your server runs, you need to plug it into an AI that can use it. The most common option is **Claude Desktop** (free).

### Step 10 — Install Claude Desktop

1. Go to: **https://claude.ai/download**
2. Download and install it
3. Sign in with a free Anthropic account

---

### Step 11 — Tell Claude about your MCP server

Claude Desktop uses a config file to know which MCP servers to load. You need to edit it.

**Find the config file:**

- **Windows:** Open File Explorer, paste this in the address bar:
  `%APPDATA%\Claude`
  Look for a file called `claude_desktop_config.json`

- **Mac:** Open Finder, press `Cmd+Shift+G`, paste:
  `~/Library/Application Support/Claude`
  Look for `claude_desktop_config.json`

**If the file doesn't exist yet**, create it.

**Open the file and add this** (replace `YOUR_USERNAME` and adjust the path to match where your project actually lives):

**Windows:**
```json
{
  "mcpServers": {
    "my-first-mcp-server": {
      "command": "node",
      "args": ["C:\\Users\\YOUR_USERNAME\\my-mcp-server\\index.js"]
    }
  }
}
```

**Mac:**
```json
{
  "mcpServers": {
    "my-first-mcp-server": {
      "command": "node",
      "args": ["/Users/YOUR_USERNAME/my-mcp-server/index.js"]
    }
  }
}
```

Save the file.

---

### Step 12 — Restart Claude Desktop

Completely quit Claude Desktop and reopen it. When it loads, it will start your MCP server in the background automatically.

**How to know it worked:**
In a Claude conversation, click the little hammer/tools icon. You should see `get_weather` listed as an available tool.

---

### Step 13 — Test it!

In Claude, type:
```
What's the weather like in Denver right now?
```

Claude will call your `get_weather` tool, your server will fetch the real weather, and Claude will tell you the answer.

**You just built and used your first MCP server.** 🏗️

---

## Part 5: Add More Tools

The pattern is always the same. For every new thing you want the AI to be able to do:

**1. Add the tool to the menu** (in `ListToolsRequestSchema`):
```javascript
{
  name: "your_tool_name",
  description: "Explain what this does so the AI knows when to use it",
  inputSchema: {
    type: "object",
    properties: {
      some_input: {
        type: "string",
        description: "What this input is for"
      }
    },
    required: ["some_input"]
  }
}
```

**2. Add the handler** (in `CallToolRequestSchema`):
```javascript
if (name === "your_tool_name") {
  const input = args.some_input;
  // Do something with the input
  return {
    content: [{ type: "text", text: "Here is the result" }]
  };
}
```

**3. Restart Claude Desktop** so it picks up your changes.

That's the whole pattern. Every MCP tool in the world follows these same three steps.

---

## Common Errors and What They Mean

| Error | What it means | Fix |
|-------|--------------|-----|
| `node: command not found` | Node.js isn't installed | Go back to Step 1 |
| `Cannot find module` | Missing toolkit | Run `npm install @modelcontextprotocol/sdk` again |
| `SyntaxError` | Typo in your code | Check for missing commas, brackets, or quotes |
| Claude doesn't show the tool | Config file path is wrong | Double-check the path in `claude_desktop_config.json` |

---

## What to Build Next

Now that you know the pattern, here are real tools you could add:

- **look_up_contact** — search your contacts for a name
- **create_reminder** — add something to a to-do list
- **get_project_status** — check a project in Workfront or Asana
- **summarize_document** — read a file and summarize it
- **send_notification** — send yourself a message

Each one follows the exact same pattern you just learned.

---

## Quick Reference Card

```
# Start a new MCP server project
mkdir my-mcp-server
cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk

# Run your server
node index.js

# Stop your server
Ctrl+C
```

---

*Built by Altared Alchemie — Faith-driven AI for businesses, churches, and creators.*
*Want help building a real MCP server for your business? → altaredalchemie.com/pilot*
