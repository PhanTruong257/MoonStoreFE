import { Link } from "react-router-dom";


import styles from "./ai-chat-widget.module.scss";
import { OrderDraftCard } from "./order-draft-card";
import {
  getMentionedProducts,
  linkifyProductMentions,
} from "./product-mentions";
import type { AiMessage } from "./use-ai-chat";

import { formatMoney } from "@/app/utils/format";
import { resolveImageUrl } from "@/app/utils/image-url";

type BotMessageProps = {
  message: AiMessage;
  onCheckout: (messageId: string) => void;
};

const buildProductLink = (productId: number) => `/product/${productId}`;

export const BotMessage = ({ message, onCheckout }: BotMessageProps) => {
  const { content, products, pending, orderDraft } = message;
  const mentioned = getMentionedProducts(content, products);

  return (
    <div className={styles.botColumn}>
      <div className={styles.bubble}>
        {pending ? (
          <span className={styles.cursor} />
        ) : (
          linkifyProductMentions(content, products)
        )}
      </div>

      {mentioned.length > 0 && (
        <div className={styles.productCards}>
          {mentioned.map((product) => (
            <Link
              key={product.id}
              to={buildProductLink(product.id)}
              className={styles.productCard}
            >
              <img
                src={resolveImageUrl(product.imageUrl)}
                alt={product.name}
                className={styles.productThumb}
              />
              <div className={styles.productInfo}>
                <span className={styles.productName}>{product.name}</span>
                <span className={styles.productPrice}>
                  {formatMoney(product.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {orderDraft && (
        <OrderDraftCard
          draft={orderDraft}
          confirming={message.draftConfirming}
          done={message.draftDone}
          onCheckout={() => onCheckout(message.id)}
        />
      )}
    </div>
  );
};
