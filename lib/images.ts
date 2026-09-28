// LabFinder — изображения из Unsplash
// Все ссылки проверены, бесплатные (Unsplash License)

export const heroImage =
  "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=75&auto=format&fit=crop";

// Обложки по категориям анализов
export const categoryImages: Record<string, string> = {
  biochemistry:
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80&auto=format&fit=crop",
  hormones:
    "https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=400&q=80&auto=format&fit=crop",
  vitamins:
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80&auto=format&fit=crop",
  general:
    "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&q=80&auto=format&fit=crop",
  immunology:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80&auto=format&fit=crop",
  allergy:
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&q=80&auto=format&fit=crop",
  infection:
    "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=400&q=80&auto=format&fit=crop",
  genetics:
    "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=400&q=80&auto=format&fit=crop",
  default:
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&q=80&auto=format&fit=crop",
};

// Обложки для комплексов
export const complexImages: Record<string, string> = {
  "healthy-heart":
    "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=600&q=80&auto=format&fit=crop",
  "vitamin-check":
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&auto=format&fit=crop",
  default:
    "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=600&q=80&auto=format&fit=crop",
};

// Обложки для статей библиотеки
export const articleImages: Record<string, string> = {
  "cholesterol-what":
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80&auto=format&fit=crop",
  "vitamin-d-why":
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80&auto=format&fit=crop",
  "glucose-norms":
    "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=600&q=80&auto=format&fit=crop",
  default:
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80&auto=format&fit=crop",
};

// Фирменные цвета лабораторий
export const labBrandColors: Record<string, string> = {
  gemotest: "#E4002B", // красный
  invitro: "#0055A5", // синий
  kdl: "#F26522", // оранжевый
  cmd: "#00A651", // зелёный
  default: "#1677FF",
};

export function getLabColor(slug: string): string {
  return labBrandColors[slug] || labBrandColors.default;
}

export function getCategoryImage(category: string): string {
  return categoryImages[category] || categoryImages.default;
}

export function getComplexImage(slug: string): string {
  return complexImages[slug] || complexImages.default;
}

export function getArticleImage(id: string): string {
  return articleImages[id] || articleImages.default;
}