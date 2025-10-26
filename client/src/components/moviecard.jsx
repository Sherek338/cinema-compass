export function MovieCard({ title, year, duration, rating, image }) {
  return (
    <div className="flex flex-col gap-[15px] w-[200px] shrink-0 group cursor-pointer">
      <div className="relative h-[273px] overflow-hidden rounded-sm">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      
      <div className="flex flex-col gap-[5px]">
        <h3 className="text-white text-[20px] font-semibold leading-tight">
          {title}
        </h3>
        
        <div className="flex items-end gap-2.5 text-white text-[15px] font-semibold">
          <span>{year}</span>
          <span>•</span>
          <span>{duration}</span>
          {rating && (
            <>
              <span>•</span>
              <div className="flex items-end gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                    <path d="M16.3458 8.95142C16.9886 8.37204 16.6419 7.30502 15.7813 7.21413L12.5459 6.87245C12.191 6.83497 11.8829 6.61116 11.7376 6.28519L10.4133 3.31494C10.0609 2.52454 8.93905 2.52454 8.58666 3.31494L7.26241 6.28519C7.11708 6.61116 6.80903 6.83497 6.4541 6.87245L3.2187 7.21413C2.35808 7.30502 2.01139 8.37204 2.65423 8.95142L5.07077 11.1294C5.33589 11.3684 5.45356 11.7305 5.37953 12.0796L4.70499 15.261C4.52549 16.1076 5.43316 16.7671 6.18284 16.3347L9.00041 14.7098C9.3096 14.5314 9.6904 14.5314 9.99959 14.7098L12.8172 16.3347C13.5668 16.7671 14.4745 16.1076 14.295 15.261L13.6205 12.0796C13.5464 11.7305 13.6641 11.3684 13.9292 11.1294L16.3458 8.95142Z" fill="#F5C519"/>
                </svg>
                <span>{rating}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
