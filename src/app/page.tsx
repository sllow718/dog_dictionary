'use client';

import { useEffect, useState } from 'react';
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
}

export default function Home() {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://api.thedogapi.com/v1/breeds')
      .then(res => res.json())
      .then(data => {
        const breedsWithoutImages = data.filter((breed: Breed) => !breed.image?.url);
        if (breedsWithoutImages.length > 0) {
          // Fetch random images from Dog CEO API
          const randomImagePromises = Array.from({ length: Math.min(breedsWithoutImages.length, 10) }, () =>
            fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json()).then(d => d.message)
          );
          Promise.all(randomImagePromises).then(randomImages => {
            breedsWithoutImages.forEach((breed, index) => {
              breed.image = { url: randomImages[index % randomImages.length] };
            });
            setBreeds(data);
            setLoading(false);
          }).catch(() => {
            setBreeds(data);
            setLoading(false);
          });
        } else {
          setBreeds(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">🐶 Loading cute dogs...</div>
      </div>
    );
  }

  const filteredBreeds = breeds.filter(breed => breed.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-orange-600 mb-2">🐕 Dog Dictionary 🐶</h1>
        <p className="text-lg text-gray-700">Discover all the adorable dog breeds in the world!</p>
      </header>
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="Search dog breeds..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredBreeds.map(breed => (
          <Link key={breed.id} href={`/breed/${breed.id}`}>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer border-2 border-yellow-200 hover:border-orange-300">
              <div className="w-full h-48 relative mb-4">
                <Image
                  src={breed.image?.url || '/placeholder-dog.svg'}
                  alt={breed.name}
                  fill
                  className="object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-dog.svg';
                  }}
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{breed.name}</h2>
              {breed.temperament && (
                <p className="text-sm text-gray-600 line-clamp-2">{breed.temperament}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
