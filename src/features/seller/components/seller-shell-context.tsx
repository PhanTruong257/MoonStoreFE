import {
  createContext,
  useContext,
  useLayoutEffect,
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

  // Serialize actions sang string để dùng làm dependency (không thể dùng ReactNode trực tiếp)
  const { title, subtitle, fullHeight } = props;

  useLayoutEffect(() => {
    ctx?.setPageProps(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, title, subtitle, fullHeight]);
};
