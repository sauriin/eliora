"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import PrayerCard from "./prayerCard";
import Image from "next/image";

function RegisterSuccessContent() {
  const searchParams = useSearchParams();
  const cardRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const fullName = searchParams.get("fullName");
  const gender = searchParams.get("gender");
  const lifeStatus = searchParams.get("lifeStatus");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!fullName || !gender) {
    return (
      <p className="min-h-screen flex items-center justify-center">
        Invalid access
      </p>
    );
  }

  const blessings = [
    `Dear God, may ${fullName}'s heart be filled with wonder and awe as they embark on this spiritual journey at Eliora. Guide them with Your wisdom and love, and may Your Word be a lamp unto their feet. May they walk in the light of Your truth and reflect Your love to others.`,
    `Heavenly Father, bless ${fullName} with courage and faith as they seek to deepen their relationship with You at Eliora. May Your presence be their guiding light, and may Your Word illuminate their path. May they trust in Your goodness and sovereignty.`,
    `Lord, may ${fullName} experience Your peace and calmness in the midst of life's challenges as they journey through Eliora. Fill them with Your joy and hope, and may Your Word be a source of comfort and strength. May they find rest in Your presence.`,
    `Dear God, grant ${fullName} wisdom and discernment as they navigate life's decisions during Eliora. May Your Word be their guiding principle, and may they seek Your guidance in all aspects of their life. May they walk in the path of righteousness.`,
    `May ${fullName} be blessed with a fresh encounter with Your love, Lord, as they participate in Eliora. Fill their heart with gratitude and their spirit with joy, and may Your Word be a flame that burns within them. May they shine Your light to others.`,
    `Heavenly Father, guide ${fullName} on their spiritual journey at Eliora. May they walk in the light of Your truth and reflect Your love to others. May Your Word be a source of wisdom and guidance for them.`,
    `Lord, may ${fullName} find strength and comfort in Your presence as they journey through Eliora. May Your Word be a source of hope and encouragement to them, and may they trust in Your goodness and sovereignty. May they experience Your peace that surpasses all understanding.`,
    `Dear God, bless ${fullName} with a deeper understanding of Your love and mercy during Eliora. May their faith be strengthened and their heart be filled with joy. May Your Word be a foundation of their life, guiding their thoughts, words, and actions.`,
    `May ${fullName} experience Your peace that surpasses all understanding, Lord, as they participate in Eliora. Guard their heart and mind in Christ Jesus, and may Your Word be a source of comfort and strength. May they walk in the path of peace.`,
    `Heavenly Father, may ${fullName} be a beacon of hope and light in their community, shining Your love and truth. May Eliora be a transformative experience for them, and may Your Word guide them in all aspects of their life.`,
    `Lord, grant ${fullName} the gift of discernment and wisdom during Eliora. May they seek Your guidance in all aspects of their life, and may Your Word be a source of wisdom and insight. May they make decisions that honor You.`,
    `Dear God, fill ${fullName}'s heart with gratitude and thanksgiving as they journey through Eliora. May they recognize Your blessings and goodness in their life, and may Your Word be a source of joy and peace. May they overflow with love and kindness.`,
    `May ${fullName} walk in the confidence of Your love and presence, Lord, as they participate in Eliora. May their faith be strengthened and their spirit be lifted, and may Your Word be a source of guidance and wisdom. May they shine Your light to others.`,
    `Heavenly Father, bless ${fullName} with a spirit of humility and openness during Eliora. May they be receptive to Your guidance and wisdom, and may Your Word be a source of transformation in their life. May they grow in faith and love.`,
    `Lord, may ${fullName} experience Your joy and peace in abundance as they journey through Eliora. May Your love be the foundation of their life, and may Your Word guide them every step of the way. May they reflect Your love and truth to others.`,
  ];

  const verses = [
    `“Your word is a lamp to my feet and a light to my path.” — Psalm 119:105`,
    `“For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.” — Jeremiah 29:11`,
    `“Because you are precious in my eyes, and honored, and I love you…” — Isaiah 43:4`,
    `“When the time is right, I, the Lord, will make it happen.” — Isaiah 60:22`,
    `“See what great love the Father has lavished on us, that we should be called children of God! And that is what we are!” — 1 John 3:1`,
    `“God is love. Whoever lives in love lives in God, and God in them.” — 1 John 4:16`,
    `“My grace is sufficient for you, for my power is made perfect in weakness.” — 2 Corinthians 12:9`,
    `“Enoch walked faithfully with God; then he was no more, because God took him away.” — Genesis 5:24`,
    `“We have this hope as an anchor for the soul, firm and secure.” — Hebrews 6:19`,
    `“Draw near to God and he will draw near to you.” — James 4:8`,
  ];

  const randomBlessing = blessings[Math.floor(Math.random() * blessings.length)];
  const randomVerse = verses[Math.floor(Math.random() * verses.length)];

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `${fullName}-eliora-prayer.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating card:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 space-y-6 bg-white">
      <Image src="/Images/image.png" alt="Prayer Image" width={500} height={500} />
      <h2 className="text-2xl font-semibold text-gray-800 text-center">
        You have taken one more step towards God!
      </h2>
      <p className="text-gray-600 text-center">
        Your registration was successful. Below is your personalized prayer card.
      </p>

      <PrayerCard
        ref={cardRef}
        fullName={fullName}
        gender={gender}
        lifeStatus={lifeStatus}
        blessing={randomBlessing}
        verse={randomVerse}
      />

      <button
        onClick={downloadCard}
        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
      >
        Download Prayer Card
      </button>
    </div>
  );
}

export default function RegisterSuccessPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <RegisterSuccessContent />
    </Suspense>
  );
}
