'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Breed {
  id: number;
  name: string;
  temperament?: string;
  life_span?: string;
  weight?: { imperial: string; metric: string };
  height?: { imperial: string; metric: string };
  image?: { url: string };
  bred_for?: string;
  breed_group?: string;
  origin?: string;
}

export default function BreedPage() {
  const params = useParams();
  const id = params.id as string;
  const [breed, setBreed] = useState<Breed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`https://api.thedogapi.com/v1/breeds/${id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.image?.url) {
            // Fetch random image from Dog CEO API
            fetch('https://dog.ceo/api/breeds/image/random')
              .then(res => res.json())
              .then(imgData => {
                data.image = { url: imgData.message };
                setBreed(data);
                setLoading(false);
              })
              .catch(() => {
                setBreed(data);
                setLoading(false);
              });
          } else {
            setBreed(data);
            setLoading(false);
          }
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">🐶 Fetching dog details...</div>
      </div>
    );
  }

  if (!breed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">🐕‍🦺 Breed not found!</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
        ← Back to all breeds
      </Link>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 border-2 border-yellow-200">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="w-full h-96 relative">
              <Image
                src={breed.image?.url || '/placeholder-dog.svg'}
                alt={breed.name}
                fill
                className="object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-dog.svg';
                }}
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-orange-600 mb-4">{breed.name}</h1>
            <div className="space-y-3">
              {breed.temperament && (
                <p><strong>Temperament:</strong> {breed.temperament}</p>
              )}
              {breed.life_span && (
                <p><strong>Life Span:</strong> {breed.life_span}</p>
              )}
              {breed.weight && (
                <p><strong>Weight:</strong> {breed.weight.imperial} lbs ({breed.weight.metric} kg)</p>
              )}
              {breed.height && (
                <p><strong>Height:</strong> {breed.height.imperial} inches ({breed.height.metric} cm)</p>
              )}
              {breed.bred_for && (
                <p><strong>Bred For:</strong> {breed.bred_for}</p>
              )}
              {breed.breed_group && (
                <p><strong>Breed Group:</strong> {breed.breed_group}</p>
              )}
              {breed.origin && (
                <p><strong>Origin:</strong> {breed.origin}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}