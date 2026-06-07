import { Link } from "react-router-dom";

import { toCategorySlug } from "@/app/utils/category-slug";
import styles from "@/features/home/category/category-section.module.scss";
import { useCategory } from "@/features/home/category/use-category";

type CategorySectionProps = {
  onCategorySelect?: (category: { id: string; label: string }) => void;
};

export const CategorySection = ({ onCategorySelect }: CategorySectionProps) => {
  const { visibleCategories } = useCategory();

  // Flatten subcategories from first 2 parent categories
  const subcategories = visibleCategories
    .filter((cat) => cat.children && cat.children.length > 0)
    .slice(0, 2)
    .flatMap((parent) => parent.children || []);

  return (
    <section className="page-section">
      <header className={styles.sectionHeaderCompact}>
        <div>
          <p className={styles.sectionLabel}>Danh mục</p>
          <h2>Danh mục nổi bật</h2>
        </div>
      </header>

      <div className={styles.categoryGrid}>
        {subcategories.map((category) => (
          <Link
            key={category.id}
            to={`/${toCategorySlug(category.label)}`}
            className={styles.categoryCard}
            onClick={() => onCategorySelect?.({ id: category.id, label: category.label })}
          >
            <div className={styles.categoryCardIcon}>📱</div>
            <span className={styles.categoryCardLabel}>{category.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
