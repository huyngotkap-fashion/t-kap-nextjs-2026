"use client";
import React from "react";

interface Props {
  title: string;
  descriptionLeft: string;
  descriptionRight: string;
}

const CategorySEO: React.FC<Props> = ({
  title,
  descriptionLeft,
  descriptionRight,
}) => {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pt-20 pb-10">

      <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight mb-10 text-center">
        {title}
      </h1>

      <div className="grid md:grid-cols-2 gap-10 text-[15px] leading-relaxed text-zinc-700">

        <p>
          {descriptionLeft}
        </p>

        <p>
          {descriptionRight}
        </p>

      </div>

    </section>
  );
};

export default CategorySEO;