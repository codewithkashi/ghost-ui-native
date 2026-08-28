# ghost-ui-native

React Native UI components with NativeWind and light/dark theming.

## Links

| | |
|---|---|
| **Website** | [ghost-ui.kashif-dev.site](https://ghost-ui.kashif-dev.site) |
| **GitHub** | [github.com/codewithkashi/ghost-ui-native](https://github.com/codewithkashi/ghost-ui-native) |
| **npm** | [ghost-ui-native](https://www.npmjs.com/package/ghost-ui-native) |

## Install

```bash
npm install ghost-ui-native
npx ghost-ui-native init --yes
```

`init --yes` installs `ghost-ui-native` plus NativeWind runtime deps, and writes Metro / Babel / `nativewind-env.d.ts` for NativeWind + `@/` aliases. Without `--yes`, it prints the suggested install commands.

On Expo, prefer `npx expo install` for native modules (`react-native-reanimated`, `react-native-safe-area-context`, `react-native-svg`, `react-native-worklets`). The CLI detects Expo and writes Expo-compatible Babel/Metro configs.

After Metro or Babel changes:

```bash
npx react-native start --reset-cache
# or: npx expo start --clear
```

## Setup

Import `./global.css` once at your app entry and wrap the root:

```tsx
import './global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GhostUIProvider } from 'ghost-ui-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <GhostUIProvider defaultTheme="system">
        <YourApp />
      </GhostUIProvider>
    </SafeAreaProvider>
  );
}
```

### Required checklist (RN CLI + NativeWind)

| Step | Action |
|------|--------|
| 1 | Install NativeWind, Tailwind 3.4, and peers |
| 2 | `global.css` + `tailwind.config.js` (`nativewind/preset`) |
| 3 | Metro: `withNativeWind(config, { input: './global.css' })` |
| 4 | Babel: `nativewind/babel` |
| 5 | `import './global.css'` in the app entry |
| 6 | `nativewind-env.d.ts` with `declare module '*.css' {}` (TS 6+) |
| 7 | `tsconfig` paths `"@/*": ["./*"]` (IDE only) |
| 8 | Babel `module-resolver` `"@": "./"` (Metro needs this) |
| 9 | Restart Metro with `--reset-cache` |

Full explanations: [SETUP.md](./SETUP.md).

### Ghost theme (default)

`ghost-ui-native init` writes a **violet-forward** theme into `global.css` — not the default shadcn zinc palette. Tokens include `--primary: 262 83% 58%`, tinted borders/accents, and `--radius: 0.75rem`. Components use rounder corners (`rounded-xl` / `rounded-2xl`), light shadows, and press feedback on primary actions.

To customize, edit CSS variables in `global.css` or replace the file after init. Re-run Metro with `--reset-cache` after token changes.

### Troubleshooting

- **TS: side-effect import of `./global.css`** — add `declare module '*.css' {}` in `nativewind-env.d.ts` (not `nativewind.d.ts`) and include that file in `tsconfig`.
- **Metro: unable to resolve `./global.css`** — wrap Metro with `withNativeWind` and add the `nativewind/babel` preset.
- **Metro: unable to resolve `@/lib/utils`** — `tsconfig` paths are not enough; configure `babel-plugin-module-resolver` with `"@": "./"` and `--reset-cache`.

## Usage

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Text,
  useGhostTheme,
} from 'ghost-ui-native';

function Example() {
  const { toggleTheme, resolvedTheme } = useGhostTheme();

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Ghost UI</CardTitle>
      </CardHeader>
      <Text className="mb-3 text-muted-foreground">{resolvedTheme}</Text>
      <Button onPress={toggleTheme}>Toggle theme</Button>
    </Card>
  );
}
```

Use semantic classes: `bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `border-border`.

Theme modes: `system` | `light` | `dark`.

## Add components (source copy)

```bash
npx ghost-ui-native add button card dialog
npx ghost-ui-native add --all --yes
```

| Command | Description |
|---------|-------------|
| `init` | Configure the project |
| `add` | Copy components into the project |
| `list` | List components |
| `search` | Search components |
| `view` | View component metadata |
| `diff` | Diff local files vs registry |
| `doctor` | Check project setup |

Flags: `--yes` `--overwrite` `--dry-run` `--diff` `--all`

## Components

`Text` `Button` `Badge` `Separator` `Card` `Skeleton` `Avatar` `Progress` `AspectRatio` `Input` `Textarea` `Label` `Checkbox` `Switch` `RadioGroup` `Slider` `Toggle` `Accordion` `Collapsible` `Tabs` `Dialog` `AlertDialog` `Select` `Sheet` `Alert` `Toast` `Empty` `Breadcrumb` `Pagination` `Popover` `Tooltip` `DropdownMenu` `Drawer` `InputOTP` `Table` `Carousel` `Spinner` `Bubble` `Marker` `Message` `MessageScroller` `Calendar` `GhostUIProvider`

## Links

- Documentation: https://ghost-ui.kashif-dev.site
- GitHub: https://github.com/codewithkashi/ghost-ui-native
- npm: https://www.npmjs.com/package/ghost-ui-native

## License

MIT
