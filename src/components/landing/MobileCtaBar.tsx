import { MessageCircle, Phone } from "lucide-react";
import EnquireButton from "@/components/forms/EnquireButton";
import { site, whatsappLink } from "@/data/site";

// Fixed bottom action bar on phones: Call · WhatsApp · Enquire.
export default function MobileCtaBar({ name, source, whatsappMessage }: { name: string; source: string; whatsappMessage?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 bg-navy-950 text-white lg:hidden">
      <a href={site.phoneHref} className="flex flex-col items-center gap-1 py-3 text-xs font-semibold">
        <Phone className="size-5 text-gold-400" /> Call
      </a>
      <a href={whatsappLink(whatsappMessage)} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 border-x border-white/10 py-3 text-xs font-semibold">
        <MessageCircle className="size-5 text-[#25D366]" /> WhatsApp
      </a>
      <EnquireButton title="Register your EOI" reason="EOI registration" project={name} source={source} className="flex flex-col items-center gap-1 bg-gold-500 py-3 text-xs font-semibold text-navy-950">
        <span className="text-base leading-5 font-bold">EOI</span> Enquire
      </EnquireButton>
    </div>
  );
}
