import { FC, ReactNode, useContext, useEffect, useState } from 'react';
import { I18nContext } from '.';

type I18nNsProps = {
  ns: string | readonly string[];
  renderWhileLoading?: boolean | ReactNode;
};

export type Props = I18nNsProps & {
  children: ReactNode;
};

export const PreloadI18nNs: FC<Props> = ({
  ns,
  children,
  renderWhileLoading,
}) => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('<I18nextProvider> not found');
  }
  const [ready, setReady] = useState(false);

  useEffect(() => {
    ctx.i18n.loadNamespaces(ns).then(() => setReady(true));
  }, [ctx, ns]);

  if (ready || renderWhileLoading === true) return children;
  if (!renderWhileLoading) return null;
  return renderWhileLoading;
};

/**
 * `useTranslation` hook automatically loads the i18n namespaces when needed
 * but if a component wants to use `i18n.t` then the namespaces need to be
 * loaded manually, re-render triggered again (with the proper side-effect
 * handling), etc.
 *
 * By wrapping a component with this HOC, the component rendering will be
 * delayed until the data is loaded (which in Electron it should be almost
 * instantly as it loads from the main process via IPC)
 */
export const WithI18nNs = <P extends object = object>(
  nsOrOptions: string | string[] | I18nNsProps,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  Component: FC<P>
) => {
  const ns =
    typeof nsOrOptions === 'object'
      ? (nsOrOptions as I18nNsProps).ns
      : nsOrOptions;

  const C: FC<P> = (props: P) => (
    <PreloadI18nNs ns={ns}>
      <Component {...props} />
    </PreloadI18nNs>
  );
  C.displayName = Component.displayName;

  return C;
};
