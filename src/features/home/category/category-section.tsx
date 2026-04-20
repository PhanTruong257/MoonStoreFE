import styles from "@/features/home/category/category-section.module.scss";
import { useCategory } from "@/features/home/category/use-category";

type CategorySectionProps = {
  onCategorySelect?: (category: { id: string; label: string }) => void;
};

export const CategorySection = ({ onCategorySelect }: CategorySectionProps) => {
  const {
    activeCategoryId,
    visibleCategories,
    nextCategory,
    previousCategory,
    setActiveCategory,
  } = useCategory();

  return (
    <section className="page-section">
      <header className={styles.sectionHeaderCompact}>
        <div>
          <p className={styles.sectionLabel}>Categories</p>
          <h2>Browse By Category</h2>
        </div>

        <div className={styles.arrowControls}>
          <button type="button" onClick={previousCategory}>
            &lt;
          </button>
          <button type="button" onClick={nextCategory}>
            &gt;
          </button>
        </div>
      </header>

      <div className={styles.categoryGrid}>
        {visibleCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={
              activeCategoryId === category.id ? styles.categoryActive : ""
            }
            onClick={() => {
              setActiveCategory(category.id);
              onCategorySelect?.({ id: category.id, label: category.label });
            }}
          >
            {category.label}
          </button>
        ))}
      </div>
    </section>
  );
};
