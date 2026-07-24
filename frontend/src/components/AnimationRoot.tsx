"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Client-side motion engine — replicates the original page's scripts:
 *  1. Lenis smooth scrolling driven by the GSAP ticker
 *  2. Heading word-split + blur reveal on scroll
 *  3. Image parallax (scrubbed)
 *  4. Fade-up for paragraphs / buttons / groups
 *  5. Hero intro choreography + per-section reveals
 */
export default function AnimationRoot() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    /* ---------------- Lenis smooth scroll ---------------- */
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0, 0);

    /* ------------- Split plain headings into words -------- */
    const headings = document.querySelectorAll("h1, h2, h3");
    headings.forEach((heading) => {
      const spans = heading.querySelectorAll("span");
      if (spans.length === 0 && heading.children.length === 0) {
        const text = heading.textContent ?? "";
        heading.innerHTML = text
          .split(" ")
          .map(
            (w) =>
              `<span style="display:inline-block; overflow:hidden;"><span class="word" style="display:inline-block;">${w}&nbsp;</span></span>`
          )
          .join("");
      }
    });

    /* ------------- Heading word/blur reveal --------------- */
    headings.forEach((heading) => {
      let targets = heading.querySelectorAll(".word");
      if (targets.length === 0) targets = heading.querySelectorAll("span");
      gsap.fromTo(
        targets,
        { opacity: 0, y: 100, filter: "blur(12px)" },
        {
          scrollTrigger: { trigger: heading, start: "top 90%" },
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.5,
          stagger: 0.1,
          ease: "power4.out",
        }
      );
    });

    /* ---------------- Image parallax ---------------------- */
    const images = document.querySelectorAll("img.object-cover");
    images.forEach((img) => {
      if (img.parentElement) img.parentElement.style.overflow = "hidden";
      gsap.fromTo(
        img,
        { y: "-15%", scale: 1.15 },
        {
          scrollTrigger: {
            trigger: img.parentElement as Element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
          y: "15%",
          ease: "none",
        }
      );
    });

    /* ---------------- Fade-up elements -------------------- */
    const fadeElements = document.querySelectorAll("p, button:not(header button), details, .group");
    fadeElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30, filter: "blur(8px)" },
        {
          scrollTrigger: { trigger: el, start: "top 95%" },
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power3.out",
        }
      );
    });

    /* ---------------- Hero intro choreography ------------- */
    gsap.from(".reveal-block > *", {
      y: 24,
      opacity: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
    });

    gsap.from(".label-pill", {
      y: 18,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      delay: 0.35,
      ease: "power3.out",
    });

    gsap.from(".connector-line", {
      strokeDashoffset: 80,
      opacity: 0,
      duration: 1.2,
      stagger: 0.12,
      delay: 0.6,
      ease: "power2.out",
    });

    /* ---------------- Section reveals --------------------- */
    gsap.utils.toArray(".frame-section").forEach((section) => {
      gsap.from(section as Element, {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section as Element,
          start: "top 82%",
        },
      });
    });

    gsap.from(".metric-card, .asset-card, .protocol-row", {
      y: 18,
      opacity: 0,
      duration: 0.65,
      stagger: 0.06,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#signals",
        start: "top 78%",
      },
    });

    gsap.from(".ui-card", {
      y: 18,
      opacity: 0,
      duration: 0.65,
      stagger: 0.06,
      ease: "power3.out",
      scrollTrigger: {
        trigger: "#core-architecture",
        start: "top 78%",
      },
    });

    /* ---------------- Cleanup ----------------------------- */
    return () => {
      lenis.destroy();
      gsap.ticker.remove(ticker);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return null;
}
