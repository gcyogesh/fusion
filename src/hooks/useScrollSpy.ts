import { useState, useEffect } from "react";

const useScrollSpy = (navItems: { id: string }[], offset = 150) => {
  const [activeSection, setActiveSection] = useState(navItems[0]?.id || "");

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const top = section.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [navItems]);

  return { activeSection, scrollToSection };
};

export default useScrollSpy;
