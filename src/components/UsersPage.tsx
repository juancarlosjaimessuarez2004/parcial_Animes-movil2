import axios from "axios";
import { useEffect, useState } from "react";
import './style.css'; // Importa tu archivo CSS aquí

interface JikanAnimeResponse {
  data: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    synopsis: string;
    episodes: number;
    score: number;
    genres: { name: string }[];
  }[];
}

const loadAllAnimeData = async (page: number): Promise<JikanAnimeResponse> => {
  try {
    const { data } = await axios.get<JikanAnimeResponse>(`https://api.jikan.moe/v4/anime?page=${page}&limit=10`);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return { data: [] };
  }
};

const AnimePage = () => {
  const [animeData, setAnimeData] = useState<JikanAnimeResponse>({ data: [] });
  const [currentAnimeIndex, setCurrentAnimeIndex] = useState(0); 
  const [loading, setLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1); 

  useEffect(() => {
    loadAllAnimeData(currentPage).then(data => {
      setAnimeData(data);
      setLoading(false); 
    });
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < 3800) { // Cambia esto a la cantidad máxima de páginas disponibles
      setCurrentPage(currentPage + 1);
      setCurrentAnimeIndex(0); // Reinicia el índice al cambiar de página
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setCurrentAnimeIndex(0);
    }
  };

  return (
    <div>
      {loading && <p>Cargando datos de anime...</p>}

      {animeData.data.length > 0 && !loading && (
        <div>
          <h2>{animeData.data[currentAnimeIndex].title}</h2>
          <img
            src={animeData.data[currentAnimeIndex].images.jpg.image_url || 'https://via.placeholder.com/100'}
            alt={animeData.data[currentAnimeIndex].title}
          />
          <p><strong>Sinopsis:</strong> {animeData.data[currentAnimeIndex].synopsis}</p>
          <p><strong>Episodios:</strong> {animeData.data[currentAnimeIndex].episodes}</p>
          <p><strong>Puntuación:</strong> {animeData.data[currentAnimeIndex].score}</p>
          <p><strong>Géneros:</strong> {animeData.data[currentAnimeIndex].genres.map(genre => genre.name).join(', ')}</p>
        </div>
      )}

      <div>
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          Anterior
        </button>
        <button onClick={handleNext} disabled={currentPage === 3800}> {/* Ajusta según la cantidad total de páginas */}
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default AnimePage;
