'use client';

import { useEffect, useState } from 'react';

const googleReviewsUrl = 'https://share.google/q1Q1BTskvtG07SKmX';
type Review = { author: string; text: string; rating: number; authorUrl?: string; authorPhoto?: string; reviewUrl?: string; published?: string };
type ReviewData = { rating: number; total: number; reviews: Review[] };

const fallback: ReviewData = { rating: 5, total: 3, reviews: [
  { author: 'Anaso M.', rating: 5, text: 'Sehr freundliches Team, blitzschnell und sauber gearbeitet. Gerne wieder!' },
  { author: 'Yevhenii Turchak', rating: 5, text: 'Ich bin sehr zufrieden. Danke für alles.' },
  { author: 'Hanna Kryventsova', rating: 5, text: 'Ich bin sehr zufrieden mit der Möbelmontage. Die Arbeit wurde professionell, sorgfältig und zuverlässig durchgeführt. Alles wurde sauber und ordentlich …' },
] };

let mapsPromise: Promise<void> | undefined;
let liveDataPromise: Promise<ReviewData | null> | undefined;

function loadGoogleMaps(key: string) {
  if ((window as any).google?.maps?.importLibrary) return Promise.resolve();
  if (mapsPromise) return mapsPromise;
  mapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&libraries=places`;
    script.async = true;
    script.dataset.googlePlaces = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps konnte nicht geladen werden.'));
    document.head.appendChild(script);
  });
  return mapsPromise;
}

function fetchLiveReviews(key: string) {
  if (liveDataPromise) return liveDataPromise;
  liveDataPromise = (async () => {
    try {
      await loadGoogleMaps(key);
      const { Place } = await (window as any).google.maps.importLibrary('places');
      const result = await Place.searchByText({ textQuery: 'Saarmontage, Fischbachstraße, 66113 Saarbrücken', fields: ['id', 'displayName'], language: 'de', maxResultCount: 1 });
      const place = result.places?.[0];
      if (!place) return null;
      await place.fetchFields({ fields: ['rating', 'userRatingCount', 'reviews'] });
      const reviews = (place.reviews ?? []).map((review: any): Review => ({
        author: review.authorAttribution?.displayName || 'Google-Nutzer',
        authorUrl: review.authorAttribution?.uri,
        authorPhoto: review.authorAttribution?.photoURI,
        reviewUrl: review.googleMapsURI,
        published: review.relativePublishTimeDescription,
        rating: Number(review.rating) || 5,
        text: String(review.text || review.originalText || '').trim(),
      })).filter((review: Review) => review.text);
      return reviews.length ? { rating: Number(place.rating) || 5, total: Number(place.userRatingCount) || reviews.length, reviews } : null;
    } catch { return null; }
  })();
  return liveDataPromise;
}

function useReviewData() {
  const [data, setData] = useState<ReviewData>(fallback);
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return;
    let active = true;
    fetchLiveReviews(key).then(live => { if (active && live) setData(live); });
    return () => { active = false; };
  }, []);
  return data;
}

const formatRating = (rating: number) => rating.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function GoogleRatingBadge() {
  const data = useReviewData();
  return <a className="hero-rating-badge" href={googleReviewsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Google-Bewertung: ${formatRating(data.rating)} von 5 Sternen, ${data.total} Bewertungen. Bei Google ansehen`}><span className="google-word">Google</span><span className="hero-rating-stars" aria-hidden="true">★★★★★</span><strong>{formatRating(data.rating)}</strong><small>{data.total} Bewertungen ansehen ↗</small></a>;
}

export function Reviews() {
  const data = useReviewData();
  return <section id="reviews" className="section reviews-section" aria-labelledby="reviews-title"><div className="container reviews-grid"><div className="reviews-intro"><p className="eyebrow">Google-Bewertungen</p><h2 id="reviews-title">Von Kundinnen und Kunden empfohlen.</h2><div className="google-rating"><span aria-label={`${data.rating} von 5 Sternen`}>★★★★★</span><strong>{formatRating(data.rating)}</strong><small>{data.total} Google-Bewertungen</small></div><a className="text-link" href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">Alle Bewertungen direkt bei Google ansehen ↗</a><p className="review-order-note">Google wählt und sortiert angezeigte Bewertungen nach Relevanz.</p></div><div className="review-list">{data.reviews.map((review, index) => <figure className="review-card" key={`${review.author}-${index}`}><div className="review-source"><span className="google-word">Google</span><span className="review-stars" aria-label={`${review.rating} von 5 Sternen`}>{'★'.repeat(Math.round(review.rating))}</span></div><blockquote>„{review.text}“</blockquote><figcaption>{review.authorPhoto ? <img src={review.authorPhoto} alt="" width="42" height="42" referrerPolicy="no-referrer"/> : <span className="review-avatar" aria-hidden="true">{review.author.charAt(0)}</span>}<span>{review.authorUrl ? <a href={review.authorUrl} target="_blank" rel="noopener noreferrer"><strong>{review.author}</strong></a> : <strong>{review.author}</strong>}<small>{review.published || 'Google-Bewertung'} · {review.rating} von 5 Sternen{review.reviewUrl && <> · <a href={review.reviewUrl} target="_blank" rel="noopener noreferrer">Original ↗</a></>}</small></span></figcaption></figure>)}</div></div></section>;
}
