import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const pos     = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const onMove = e => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    const loop = () => {
      const p = pos.current;
      p.rx += (p.mx - p.rx) * 0.13;
      p.ry += (p.my - p.ry) * 0.13;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${p.mx - 5}px, ${p.my - 5}px)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${p.rx - 20}px, ${p.ry - 20}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const grow   = () => { if (ringRef.current) { ringRef.current.style.width = ringRef.current.style.height = "54px"; ringRef.current.style.opacity = "0.22"; } };
    const shrink = () => { if (ringRef.current) { ringRef.current.style.width = ringRef.current.style.height = "40px"; ringRef.current.style.opacity = "0.45"; } };
    document.querySelectorAll("a,button,input,[role=button]").forEach(el => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[10px] h-[10px] rounded-full pointer-events-none z-[9999]"
        style={{ background: "var(--color-accent)", mixBlendMode: "difference" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9998]"
        style={{
          border: "1.5px solid var(--color-accent)",
          opacity: 0.45,
          transition: "width 0.2s, height 0.2s, opacity 0.2s",
        }}
      />
    </>
  );
}
