import { Link } from "react-router-dom";

export default function MediaCard({ id, title, name, poster, rating, year, duration, seasons, isSeries }) {
  const displayTitle = title || name;
  const route = isSeries ? `/series/${id}` : `/movie/${id}`;

  return (
    <Link to={route} className="flex flex-col gap-[15px] group">
      <img
        src={poster}
        alt={displayTitle}
        className="w-full h-[273px] object-cover rounded-lg group-hover:scale-[1.02] transition-transform"
      />
      <div className="flex flex-col gap-[5px]">
        <h3 className="text-white font-semibold text-xl line-clamp-1">{displayTitle}</h3>
        <div className="flex items-end gap-2.5 text-white font-semibold text-[15px]">
          <span>{year}</span>
          <span>•</span>
          <span>{isSeries ? seasons : duration}</span>
          <span>•</span>
          <div className="flex items-end gap-1">
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.346 8.95142C16.9889 8.37204 16.6422 7.30502 15.7815 7.21413L12.5461 6.87245C12.1912 6.83497 11.8832 6.61116 11.7378 6.28519L10.4136 3.31494C10.0612 2.52454 8.9393 2.52454 8.58691 3.31494L7.26266 6.28519C7.11732 6.61116 6.80927 6.83497 6.45434 6.87245L3.21894 7.21413C2.35832 7.30502 2.01163 8.37204 2.65447 8.95142L5.07101 11.1294C5.33613 11.3684 5.4538 11.7305 5.37978 12.0796L4.70524 15.261C4.52574 16.1076 5.43341 16.7671 6.18308 16.3347L9.00065 14.7098C9.30985 14.5314 9.69064 14.5314 9.99983 14.7098L12.8174 16.3347C13.5671 16.7671 14.4747 16.1076 14.2952 15.261L13.6207 12.0796C13.5467 11.7305 13.6644 11.3684 13.9295 11.1294L16.346 8.95142Z" fill="#F5C519"/>
            </svg>
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
