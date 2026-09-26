/* ============================================================
   🎨 UI COMPONENTS — Barrel Export
   ─────────────────────────────────────────────
   Clean imports for all UI components.
   
   Usage:
     import { Button, Input, Modal } from "@/components/ui";
     import { Card, CardHeader, CardBody } from "@/components/ui";
   ============================================================ */

/* ============================================================
   🎯 CORE COMPONENTS
   ============================================================ */

// Button — Action button with variants
export { default as Button } from "./Button/Button";

// Input — Form input with icon/error/hint
export { default as Input } from "./Input/Input";

// Modal — Dialog with portal + focus trap
export { default as Modal } from "./Modal/Modal";

/* ============================================================
   🎯 DATA DISPLAY
   ============================================================ */

// Badge — Status indicator
export { default as Badge } from "./Badge/Badge";

// Avatar — User avatar with initials fallback
export { default as Avatar, AvatarGroup } from "./Avatar/Avatar";

// Card — Container component
export { default as Card } from "./Card/Card";
export {
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardFooter,
} from "./Card/Card";

// Sparkline — Mini chart
export { default as Sparkline } from "./Sparkline/Sparkline";

// DataTable — Sortable + searchable table
export { default as DataTable } from "./DataTable/DataTable";