export const GLOBAL_CSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 99%;
    --foreground: 260 25% 10%;
    --card: 0 0% 100%;
    --card-foreground: 260 25% 10%;
    --popover: 0 0% 100%;
    --popover-foreground: 260 25% 10%;
    --primary: 262 83% 58%;
    --primary-foreground: 0 0% 100%;
    --secondary: 260 30% 94%;
    --secondary-foreground: 262 45% 28%;
    --muted: 260 25% 96%;
    --muted-foreground: 260 8% 45%;
    --accent: 262 55% 96%;
    --accent-foreground: 262 50% 32%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;
    --border: 260 18% 90%;
    --input: 260 18% 88%;
    --ring: 262 83% 58%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 260 18% 7%;
    --foreground: 260 15% 96%;
    --card: 260 16% 10%;
    --card-foreground: 260 15% 96%;
    --popover: 260 16% 10%;
    --popover-foreground: 260 15% 96%;
    --primary: 262 90% 72%;
    --primary-foreground: 262 45% 12%;
    --secondary: 260 18% 16%;
    --secondary-foreground: 260 15% 92%;
    --muted: 260 14% 14%;
    --muted-foreground: 260 8% 62%;
    --accent: 262 35% 18%;
    --accent-foreground: 262 80% 85%;
    --destructive: 0 62% 45%;
    --destructive-foreground: 0 0% 100%;
    --border: 260 12% 20%;
    --input: 260 12% 22%;
    --ring: 262 90% 72%;
  }
}
`;
