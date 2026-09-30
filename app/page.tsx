"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const petals = [
  [5, 0, 12, 1],
  [16, 5, 15, 6],
  [27, 1, 11, 3],
  [41, 7, 17, 8],
  [55, 3, 14, 0],
  [68, 8, 12, 5],
  [80, 2, 16, 7],
  [93, 6, 13, 2],
] as const;

const eventTime = new Date("2026-10-26T21:00:00+05:30").getTime();

function PaintedRule({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`painted-rule ${dark ? "painted-rule-dark" : ""}`} aria-hidden="true">
      <i />
      <b>✦</b>
      <i />
    </span>
  );
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [bellRinging, setBellRinging] = useState(false);
  const [stageSettled, setStageSettled] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const songRef = useRef<HTMLAudioElement | null>(null);
  const ceremonyTimers = useRef<number[]>([]);

  useEffect(() => () => ceremonyTimers.current.forEach(window.clearTimeout), []);

  useEffect(() => {
    const updateTime = () => setTimeLeft(Math.max(0, eventTime - Date.now()));
    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const song = songRef.current;
    if (!song) return;

    const handlePlay = () => setSoundOn(true);
    const handlePause = () => setSoundOn(false);

    song.addEventListener("play", handlePlay);
    song.addEventListener("pause", handlePause);

    return () => {
      song.pause();
      song.removeEventListener("play", handlePlay);
      song.removeEventListener("pause", handlePause);
    };
  }, []);

  useEffect(() => {
    if (!opened || !storyRef.current) return;

    const root = storyRef.current;
    const items = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root, threshold: 0.16, rootMargin: "-2% 0px -8%" },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [opened]);

  const startSound = () => {
    const song = songRef.current;
    if (!song) return;

    song.volume = 0.48;
    void song.play().catch(() => setSoundOn(false));
  };

  const openInvitation = () => {
    if (opened || bellRinging) return;
    startSound();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpened(true);
      setStageSettled(true);
      return;
    }
    setBellRinging(true);
    ceremonyTimers.current.push(window.setTimeout(() => setOpened(true), 480));
    ceremonyTimers.current.push(window.setTimeout(() => setStageSettled(true), 6200));
  };

  const totalSeconds = Math.floor((timeLeft ?? 0) / 1000);
  const countdownParts = [
    { label: "दिन", value: Math.floor(totalSeconds / 86400) },
    { label: "घंटे", value: Math.floor((totalSeconds % 86400) / 3600) },
    { label: "मिनट", value: Math.floor((totalSeconds % 3600) / 60) },
    { label: "सेकंड", value: totalSeconds % 60 },
  ];

  const toggleSound = () => {
    const song = songRef.current;
    if (!song) return;

    if (song.paused) {
      startSound();
    } else {
      song.pause();
    }
  };

  return (
    <main className={`invitation ${opened ? "is-open" : ""} ${stageSettled ? "is-settled" : ""}`}>
      <audio
        ref={songRef}
        src="/audio/shyam-ka-rang-chad-gaya.mp3"
        preload="metadata"
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="paper-grain" aria-hidden="true" />
      <div className="petals" aria-hidden="true">
        {petals.map(([left, top, duration, delay], index) => (
          <span
            key={`${left}-${duration}`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDuration: `${duration}s`,
              animationDelay: `-${delay}s`,
              ["--petal-rotation" as string]: `${index % 2 ? 260 : 390}deg`,
            }}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="sound-control"
        onClick={toggleSound}
        aria-label={soundOn ? "Pause Shyam Ka Rang Chad Gaya" : "Play Shyam Ka Rang Chad Gaya"}
        title={soundOn ? "Pause devotional song" : "Play devotional song"}
      >
        {soundOn ? <Volume2 /> : <VolumeX />}
      </Button>

      <Button asChild variant="ghost" size="icon" className="location-control">
        <a
          href="https://maps.app.goo.gl/6La46gfEAJXj6BnY8"
          target="_blank"
          rel="noreferrer"
          aria-label="Open location in Google Maps"
          title="Open location"
        >
          <MapPin aria-hidden="true" />
        </a>
      </Button>

      <div className="story" ref={storyRef} aria-hidden={!stageSettled} inert={!stageSettled}>
        <section className="scene hero-scene" id="darshan">
          <div className="folk-corner corner-one" aria-hidden="true" />
          <div className="folk-corner corner-two" aria-hidden="true" />
          <div className="hero-ornaments" aria-hidden="true">
            <img className="hero-dome" src="/ornaments/dome.webp" alt="" />
            <img className="hero-toran" src="/ornaments/toran.webp" alt="" />
            <div className="hero-bells">
              <span className="hero-bell hero-bell-one"><img src="/ornaments/bell.webp" alt="" /></span>
              <span className="hero-bell hero-bell-two"><img src="/ornaments/bell.webp" alt="" /></span>
              <span className="hero-bell hero-bell-three"><img src="/ornaments/bell.webp" alt="" /></span>
            </div>
            <img className="hero-creeper hero-creeper-left" src="/ornaments/creeper.webp" alt="" />
            <img className="hero-creeper hero-creeper-right" src="/ornaments/creeper-flip.webp" alt="" />
            <img className="hero-rose hero-rose-left" src="/ornaments/rose-corner.webp" alt="" />
            <img className="hero-rose hero-rose-right" src="/ornaments/rose-corner.webp" alt="" />
          </div>
          <div className="hero-floral-boundary" aria-hidden="true">
            <Image
              src="/art/floral-boundary-frame.webp"
              alt=""
              fill
              priority
              sizes="(max-width: 760px) 100vw, 750px"
              className="hero-floral-art"
            />
          </div>
          <div className="scene-frame hero-frame">
            <div className="hero-heading ceremony-heading">
              <p className="eyebrow devanagari">॥ श्री श्याम ॥</p>
              <PaintedRule dark />
            </div>
            <div className="portrait-wrap ceremony-portrait">
              <span className="portrait-sun" aria-hidden="true" />
              <Image
                src="/art/khatu-shyam-cartoon-v2.webp"
                alt="Hand-painted illustrated portrait of Khatu Shyam Ji"
                width={1145}
                height={1374}
                priority
                sizes="(max-width: 700px) 82vw, 485px"
                className="portrait-art"
              />
            </div>
            <div className="hero-copy ceremony-copy">
              <p className="micro-copy">A sacred evening of bhakti &amp; bhajans</p>
              <h1 className="devanagari">
                <span className="title-line title-line-one">श्री श्याम</span>
                <span className="title-line title-line-two">संकीर्तन संध्या</span>
              </h1>
              <p className="invitation-line devanagari">आप सपरिवार सादर आमंत्रित हैं</p>
            </div>
            <a className="scroll-cue ink" href="#invitation" aria-label="Continue to the invitation">
              <span>आगे देखिए</span>
              <ChevronDown aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="scene invitation-scene" id="invitation">
          <div className="paper-panel scene-frame invitation-frame">
            <div className="painted-arch" aria-hidden="true">
              <span />
            </div>
            <div className="invitation-ornaments" aria-hidden="true">
              <img className="invitation-vine invitation-vine-left" src="/ornaments/creeper.webp" alt="" />
              <img className="invitation-vine invitation-vine-right" src="/ornaments/creeper-flip.webp" alt="" />
              <img className="invitation-lotus" src="/ornaments/lotus.webp" alt="" />
            </div>
            <div className="reveal" data-reveal>
              <p className="eyebrow devanagari">हारे का सहारा</p>
              <h2 className="devanagari">श्याम हमारा</h2>
              <PaintedRule dark />
            </div>
            <p className="lead devanagari reveal" data-reveal>
              भक्ति, संगीत और प्रेम से सजी इस पावन रात्रि में<br />
              आपका सान्निध्य हमारे लिए आशीर्वाद होगा।
            </p>
            <p className="small-serif reveal" data-reveal>WITH LOVE &amp; DEVOTION</p>
            <div className="elephant-procession reveal" data-reveal aria-hidden="true">
              <span className="elephant-path" />
              <img className="elephant elephant-left" src="/art/elephant.webp" alt="" width="412" height="404" loading="lazy" />
              <span className="elephant-star">✦</span>
              <img className="elephant elephant-right" src="/art/elephant-flip.webp" alt="" width="412" height="404" loading="lazy" />
            </div>
            <a className="scroll-cue" href="#journey" aria-label="Continue to the painted journey">
              <span>चित्र कथा</span>
              <ChevronDown aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="scene journey-scene" id="journey">
          <Image
            src="/art/elephant-procession-scene.png"
            alt="Hand-painted ceremonial elephant walking toward a temple"
            fill
            sizes="100vw"
            className="journey-art"
          />
          <div className="journey-wash" aria-hidden="true" />
          <img className="journey-bush journey-bush-left" src="/ornaments/bush.webp" alt="" aria-hidden="true" />
          <img className="journey-bush journey-bush-right" src="/ornaments/bush-flip.webp" alt="" aria-hidden="true" />
          <div className="scene-frame journey-frame">
            <div className="journey-card reveal reveal-right" data-reveal>
              <p className="eyebrow devanagari">एक पावन यात्रा</p>
              <h2>Where devotion<br />finds its way home</h2>
              <PaintedRule dark />
              <p className="devanagari">दीपों की रोशनी, भजनों की धुन और श्याम नाम की महिमा।</p>
            </div>
            <a className="scroll-cue ink" href="#details" aria-label="View the event details">
              <span>कार्यक्रम विवरण</span>
              <ChevronDown aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="scene details-scene" id="details">
          <div className="scene-frame details-frame">
            <img className="section-damask" src="/ornaments/damask.webp" alt="" aria-hidden="true" />
            <div className="reveal" data-reveal>
              <p className="eyebrow devanagari">कार्यक्रम</p>
              <h2>One divine evening</h2>
              <PaintedRule />
            </div>
            <div className="details-grid">
              <article className="reveal reveal-delay-1" data-reveal>
                <CalendarDays aria-hidden="true" />
                <span>DATE</span>
                <strong>26 October</strong>
                <p>Monday · 2026</p>
              </article>
              <article className="reveal reveal-delay-2" data-reveal>
                <Clock3 aria-hidden="true" />
                <span>TIME</span>
                <strong>9:00 PM</strong>
                <p>Sankirtan begins</p>
              </article>
              <article className="reveal reveal-delay-3" data-reveal>
                <MapPin aria-hidden="true" />
                <span>VENUE</span>
                <strong>Gurugram</strong>
                <p>Open the exact location in Maps</p>
              </article>
            </div>
            <p className="note devanagari reveal" data-reveal>प्रसाद एवं आशीर्वाद के साथ</p>
            <a className="scroll-cue" href="#countdown" aria-label="View time remaining until the Sankirtan">
              <span>शेष समय</span>
              <ChevronDown aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="scene countdown-scene" id="countdown" aria-labelledby="countdown-title">
          <div className="scene-frame countdown-frame">
            <img className="countdown-emblem reveal" data-reveal src="/art/shyam-calligraphy.png" alt="" aria-hidden="true" width="360" height="360" loading="lazy" />
            <div className="reveal" data-reveal>
              <p className="eyebrow devanagari">॥ जय श्री श्याम ॥</p>
              <h2 className="devanagari" id="countdown-title">श्याम मिलन में शेष</h2>
              <PaintedRule dark />
              <time className="countdown-date devanagari" dateTime="2026-10-26T21:00:00+05:30">26 अक्टूबर 2026 · रात्रि 9 बजे</time>
            </div>
            {timeLeft === 0 ? (
              <p className="countdown-complete devanagari">यह पावन रात्रि आरंभ हो चुकी है। जय श्री श्याम!</p>
            ) : (
              <div className="countdown-grid reveal" data-reveal role="timer" aria-label="संकीर्तन संध्या शुरू होने तक शेष समय" aria-live="off">
                {countdownParts.map(({ label, value }) => (
                  <div className="countdown-unit" key={label}>
                    <strong>{timeLeft === null ? "--" : String(value).padStart(2, "0")}</strong>
                    <span className="devanagari">{label}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="countdown-blessing devanagari reveal" data-reveal>भजनों की इस रात्रि में आप सपरिवार पधारें।</p>
            <a className="scroll-cue ink" href="#host" aria-label="Continue to host details">
              <span>परिवार की ओर से</span>
              <ChevronDown aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="scene host-scene" id="host">
          <div className="scene-frame host-frame">
            <div className="host-copy reveal" data-reveal>
              <p className="eyebrow">HOSTED WITH DEVOTION BY</p>
              <h2>GUPTA&apos;S<br />FAMILY</h2>
              <PaintedRule />
              <p className="devanagari">श्याम प्रेमियों के संग एक अविस्मरणीय रात्रि</p>
            </div>
            <a className="scroll-cue" href="#rsvp" aria-label="Continue to contact options">
              <span>आपका स्वागत है</span>
              <ChevronDown aria-hidden="true" />
            </a>
          </div>
        </section>

        <section className="scene rsvp-scene" id="rsvp">
          <div className="scene-frame rsvp-frame">
            <img className="rsvp-sigil" src="/art/shyam-mark.png" alt="" aria-hidden="true" width="320" height="320" loading="lazy" />
            <div className="rsvp-ornaments" aria-hidden="true">
              <img src="/ornaments/lotus-b.webp" alt="" />
              <img src="/ornaments/lotus-b-flip.webp" alt="" />
            </div>
            <div className="reveal" data-reveal>
              <p className="eyebrow devanagari">॥ शुभम् ॥</p>
              <h2 className="devanagari">पधारिए</h2>
              <p className="lead devanagari">भक्ति की इस रात्रि को अपनी उपस्थिति से पूर्ण कीजिए।</p>
              <PaintedRule dark />
            </div>
            <div className="action-grid reveal" data-reveal>
              <Button asChild className="action-button primary-action">
                <a
                  href="https://wa.me/918826399914?text=Jai%20Shree%20Shyam!%20We%20will%20join%20the%20Shri%20Shyam%20Sankirtan%20Sandhya."
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle aria-hidden="true" />
                  RSVP on WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="action-button">
                <a
                  href="https://maps.app.goo.gl/6La46gfEAJXj6BnY8"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin aria-hidden="true" />
                  Open location
                </a>
              </Button>
              <Button asChild variant="outline" className="action-button">
                <a href="tel:+918826399914">
                  <Phone aria-hidden="true" />
                  Call: 88263 99914
                </a>
              </Button>
              <Button asChild variant="outline" className="action-button">
                <a href="tel:+919899271621">
                  <Phone aria-hidden="true" />
                  Alternate: 98992 71621
                </a>
              </Button>
            </div>
            <p className="closing reveal" data-reveal>JAI SHREE SHYAM</p>
          </div>
        </section>
      </div>

      <div className={`opening ${bellRinging ? "is-ringing" : ""}`} aria-hidden={opened}>
        <div className="curtain curtain-left" aria-hidden="true">
          <span className="curtain-fold" /><span className="curtain-fold" /><span className="curtain-fold" /><span className="curtain-fold" /><span className="curtain-fold" />
        </div>
        <div className="curtain curtain-right" aria-hidden="true">
          <span className="curtain-fold" /><span className="curtain-fold" /><span className="curtain-fold" /><span className="curtain-fold" /><span className="curtain-fold" />
        </div>
        <div className="opening-thread" aria-hidden="true" />
        <img className="opening-toran" src="/ornaments/toran.webp" alt="" aria-hidden="true" />
        <div className="opening-content">
          <p className="opening-prayer devanagari">॥ जय श्री श्याम ॥</p>
          <Button
            type="button"
            variant="ghost"
            className="bell-button"
            onClick={openInvitation}
            disabled={bellRinging || opened}
            aria-label="Ring the bell and open the invitation"
          >
            <span className="bell-halo" aria-hidden="true" />
            <span className="bell-hanger" aria-hidden="true">
              <span className="bell-chain" />
              <img src="/ornaments/bell.webp" alt="" />
            </span>
          </Button>
          <Button type="button" className="opening-action" onClick={openInvitation} disabled={bellRinging || opened}>
            <span className="devanagari">दरबार में पधारें</span>
            <span className="opening-caption">TAP TO OPEN THE INVITATION</span>
          </Button>
        </div>
      </div>
    </main>
  );
}
