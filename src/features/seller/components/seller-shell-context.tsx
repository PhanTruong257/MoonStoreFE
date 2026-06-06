import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";

export type SellerShellPageProps = {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  fullHeight?: boolean;
};

type ContextValue = {
  setPageProps: (props: SellerShellPageProps) => void;
};

export const SellerShellContext = createContext<ContextValue | null>(null);

/**
 * Gọi trong seller page để set title/subtitle cho SellerShell layout.
 * Dùng useLayoutEffect để cập nhật đồng bộ trước khi browser paint → không bị flash.
 */
export const useSetSellerShell = (props: SellerShellPageProps) => {
  const ctx = useContext(SellerShellContext);
  const propsRef = useRef<SellerShellPageProps>(props);
  const { title, subtitle, fullHeight } = props;

  useLayoutEffect(() => {
    if (
      propsRef.current.title !== title ||
      propsRef.current.subtitle !== subtitle ||
      propsRef.current.fullHeight !== fullHeight
    ) {
      propsRef.current = props;
      ctx?.setPageProps(props);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, title, subtitle, fullHeight]);
};
