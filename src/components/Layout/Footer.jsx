import React from "react";
import engboostLogo from "../../assets/home/engboost-logo.png";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { routes } from "../../utils/constants";

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { title: "Về chúng tôi", href: routes.ABOUT },
    { title: "Khoá học", href: routes.COURSE },
    { title: "Blog", href: routes.BLOG },
    { title: "Liên hệ", href: routes.CONTACT },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", color: "hover:text-[#1877f2]" },
    { icon: Instagram, href: "https://instagram.com", color: "hover:text-[#e4405f]" },
    { icon: Twitter, href: "https://twitter.com", color: "hover:text-[#1da1f2]" },
    { icon: Youtube, href: "https://youtube.com", color: "hover:text-[#ff0000]" },
  ];

  return (
    <footer className="relative bg-[#1a1915] text-[#fdfcf0] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#b4c3a2]/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#dfbbb1]/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div className="p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10 shadow-xl">
                <img src={engboostLogo} alt="EngBoost Logo" className="h-10 w-auto object-contain brightness-0 invert" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-br from-white to-[#fdfcf0]/60 bg-clip-text text-transparent">
                  EngBoost
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#b4c3a2] font-semibold">Fuel your Fluency</span>
              </div>
            </div>
            <p className="text-[#fdfcf0]/60 text-sm leading-relaxed max-w-xs">
              Nâng tầm kỹ năng tiếng Anh của bạn với công nghệ AI hiện đại và phương pháp học tập tối ưu.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 transition-all duration-300 ${social.color} hover:bg-white/10 hover:-translate-y-1`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-12">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#b4c3a2] mb-6">Liên kết</h3>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    to={link.href}
                    className="text-[#fdfcf0]/70 hover:text-white transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[1px] bg-[#dfbbb1] transition-all duration-300 group-hover:w-4" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#b4c3a2] mb-6">Hỗ trợ</h3>
            <ul className="space-y-4 text-[#fdfcf0]/70">
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors duration-300">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors duration-300">Chính sách bảo mật</a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-white transition-colors duration-300">Điều khoản dịch vụ</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#b4c3a2] mb-6">Liên hệ</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#fdfcf0]/70 group">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#dfbbb1]/20 transition-colors">
                  <Mail size={14} className="text-[#dfbbb1]" />
                </div>
                <span className="text-sm hover:text-white transition-colors cursor-pointer">support@engboost.com</span>
              </div>
              <div className="flex items-center gap-3 text-[#fdfcf0]/70 group">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#b4c3a2]/20 transition-colors">
                  <Phone size={14} className="text-[#b4c3a2]" />
                </div>
                <span className="text-sm hover:text-white transition-colors cursor-pointer">1900 xxxx</span>
              </div>
              <div className="flex items-center gap-3 text-[#fdfcf0]/70 group">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#a2b5c3]/20 transition-colors">
                  <MapPin size={14} className="text-[#a2b5c3]" />
                </div>
                <span className="text-sm">Hà Nội, Việt Nam</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[#fdfcf0]/40 text-[12px] font-medium tracking-wide">
          <p>© {currentYear} EngBoost. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
