import { memo, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  Mail,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
  Send,
  Camera,
  Play as PlayIcon,
  ArrowUpRight,
  Heart,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================
   🎨 FOOTER (Rule 5)
   ─────────────────────────────────────────────
   Palette: Cyan → Violet → Blue (brand)
   ============================================================ */

/* ============================================================
   🎯 FOOTER LINKS (Rule 3)
   ============================================================ */
const footerLinks = {
  Portal: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Patients", path: "/patients" },
    { name: "Appointments", path: "/patients/appointments" },
    { name: "Lab Reports", path: "/patients/lab-reports" },
  ],
  Modules: [
    { name: "ICD Codes", path: "/icd" },
    { name: "OBGYN Diagnosis", path: "/obgyn" },
    { name: "Procedures", path: "/procedures" },
    { name: "Billing", path: "/patients/billing" },
  ],
  Administration: [
    { name: "Providers", path: "/providers" },
    { name: "Facilities", path: "/facilities" },
    { name: "Users", path: "/users" },
    { name: "Insurance", path: "/insurance" },
  ],
  System: [
    { name: "Practice Setting", path: "/practice-setting" },
    { name: "Practices", path: "/practices" },
    { name: "Module Management", path: "/modules" },
    { name: "Permissions", path: "/modules/permissions" },
  ],
};

/* ============================================================
   🎯 SOCIAL LINKS (Rule 3 — with real URLs)
   ============================================================ */
const socials = [
  {
    id: 1,
    icon: Globe,
    href: "https://facebook.com/ayinternationalhospital",
    label: "Facebook",
    color: "#1877f2",
  },
  {
    id: 2,
    icon: MessageCircle,
    href: "https://twitter.com/ayinthospital",
    label: "Twitter",
    color: "#1da1f2",
  },
  {
    id: 3,
    icon: Send,
    href: "https://linkedin.com/company/ay-international-hospital",
    label: "LinkedIn",
    color: "#0a66c2",
  },
  {
    id: 4,
    icon: Camera,
    href: "https://instagram.com/ayinternationalhospital",
    label: "Instagram",
    color: "#e4405f",
  },
  {
    id: 5,
    icon: PlayIcon,
    href: "https://youtube.com/@ayinternationalhospital",
    label: "YouTube",
    color: "#ff0000",
  },
];

/* ============================================================
   🎯 CONTACT INFO (Rule 3)
   ============================================================ */
const contactInfo = [
  {
    id: 1,
    icon: Mail,
    label: "contact@ayint-hospital.com",
    href: "mailto:contact@ayint-hospital.com",
    external: false,
  },
  {
    id: 2,
    icon: Phone,
    label: "+1 (555) 100-2000",
    href: "tel:+15551002000",
    external: false,
  },
  {
    id: 3,
    icon: MapPin,
    label: "450 Medical Center Drive, Boston, MA 02115",
    href: "https://maps.google.com/?q=450+Medical+Center+Drive+Boston+MA+02115",
    external: true,
  },
];

/* ============================================================
   🎯 LEGAL LINKS (Rule 3)
   ============================================================ */
const legalLinks = [
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms of Service", path: "/terms" },
  { name: "HIPAA Notice", path: "/hipaa" },
];

/* ============================================================
   🎯 SOCIAL ICON (memoized)
   ============================================================ */
const SocialIcon = memo(function SocialIcon({ social }) {
  const Icon = social.icon;
  const prefersReduced = useReducedMotion();

  return (
    <motion.a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={prefersReduced ? {} : { y: -3, scale: 1.1 }}
      whileTap={prefersReduced ? {} : { scale: 0.95 }}
      className={cn(
        "group relative w-10 h-10 min-w-[40px] min-h-[40px] sm:w-9 sm:h-9 sm:min-w-0 sm:min-h-0",
        "rounded-xl bg-white/[0.03] border border-white/[0.08]",
        "flex items-center justify-center",
        "hover:bg-white/[0.06] hover:border-white/[0.15]",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
      )}
      aria-label={`Visit our ${social.label} page`}
    >
      <Icon
        size={15}
        className="text-slate-400 group-hover:text-white transition-colors"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity pointer-events-none"
        style={{ background: social.color }}
        aria-hidden="true"
      />
    </motion.a>
  );
});

/* ============================================================
   🎯 MAIN: Footer
   ============================================================ */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const prefersReduced = useReducedMotion();

  /* ============================================================
     🎯 HANDLE EXTERNAL CONTACT
     ============================================================ */
  const handleContactClick = useCallback((info) => {
    if (info.external) {
      window.open(info.href, "_blank", "noopener,noreferrer");
    }
  }, []);

  return (
    <footer className="relative bg-[#080d18] overflow-hidden">
      {/* Top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
        aria-hidden="true"
      />

      {/* Ambient orb — disabled on reduced motion */}
      {!prefersReduced && (
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] will-change-transform"
          style={{
            background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============================================================
            MAIN GRID
           ============================================================ */}
        <div className="py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          {/* ============================================================
              BRAND COLUMN
             ============================================================ */}
          <div className="lg:col-span-4">
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Brand */}
              <div className="flex items-center gap-3 mb-5">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40">
                    <Activity size={22} className="text-white" strokeWidth={2.5} aria-hidden="true" />
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#080d18]"
                    aria-label="Online"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black tracking-tight text-white leading-tight truncate">
                    AY INTERNATIONAL
                  </h3>
                  <p className="text-[10px] font-bold text-cyan-400 tracking-[0.2em] uppercase leading-tight">
                    Hospital
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Intelligent hospital management system powering patient care,
                diagnostics, and revenue cycles for 500+ healthcare providers
                worldwide.
              </p>

              {/* Certifications */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Shield
                    size={11}
                    className="text-emerald-400"
                    aria-hidden="true"
                  />
                  <span className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase">
                    HIPAA
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <span className="text-[9px] font-bold text-cyan-400 tracking-wider uppercase">
                    JCI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <span className="text-[9px] font-bold text-violet-400 tracking-wider uppercase">
                    ISO 9001
                  </span>
                </div>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-2">
                {socials.map((social) => (
                  <SocialIcon key={social.id} social={social} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* ============================================================
              LINK COLUMNS
             ============================================================ */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {Object.entries(footerLinks).map(([title, links], colIdx) => (
              <motion.div
                key={title}
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: colIdx * 0.1 }}
              >
                <h4 className="text-[10px] font-black text-white tracking-[0.15em] uppercase mb-4">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className="group inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
                      >
                        <span>{link.name}</span>
                        <ArrowUpRight
                          size={10}
                          className={cn(
                            "opacity-0 group-hover:opacity-100",
                            !prefersReduced &&
                              "transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          )}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ============================================================
            CONTACT STRIP
           ============================================================ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={prefersReduced ? false : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="py-5 sm:py-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-3 sm:gap-6"
        >
          {contactInfo.map((info) => {
            const Icon = info.icon;
            return (
              <a
                key={info.id}
                href={info.href}
                onClick={() => handleContactClick(info)}
                target={info.external ? "_blank" : undefined}
                rel={info.external ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-2 text-xs text-slate-400 hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
              >
                <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center group-hover:border-cyan-500/30 transition-colors shrink-0">
                  <Icon
                    size={12}
                    className="text-slate-500 group-hover:text-cyan-400 transition-colors"
                    aria-hidden="true"
                  />
                </div>
                <span className="truncate">{info.label}</span>
              </a>
            );
          })}
        </motion.div>

        {/* ============================================================
            BOTTOM BAR
           ============================================================ */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0 }}
          whileInView={prefersReduced ? false : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="py-5 sm:py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          {/* Copyright */}
          <p className="text-[11px] text-slate-500 text-center sm:text-left">
            © {currentYear} AY International Hospital. All rights reserved.
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-slate-500 flex-wrap justify-center">
            {legalLinks.map((link, idx) => (
              <span key={link.path} className="flex items-center gap-3 sm:gap-4">
                <Link
                  to={link.path}
                  className="hover:text-cyan-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded"
                >
                  {link.name}
                </Link>
                {idx < legalLinks.length - 1 && (
                  <span
                    className="w-px h-3 bg-white/[0.1]"
                    aria-hidden="true"
                  />
                )}
              </span>
            ))}
          </div>

          {/* Made with love */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span>Made with</span>
            <Heart
              size={11}
              className={cn(
                "text-rose-500 fill-rose-500",
                !prefersReduced && "animate-pulse"
              )}
              aria-hidden="true"
            />
            <span>in Boston</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}