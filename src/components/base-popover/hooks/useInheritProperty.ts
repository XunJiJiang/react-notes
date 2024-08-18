type Props = React.HTMLAttributes<HTMLElement> &
  React.RefAttributes<HTMLElement>;

const useInheritProperty = <P extends Props>(
  rcElement: React.ReactElement | undefined,
  props: P
): P => {
  if (!rcElement) {
    return props;
  }
  const newProps: P = {} as P;
  Object.keys(props).forEach((key) => {
    if (key === 'ref') {
      newProps.ref = (node: HTMLElement | null) => {
        if ('ref' in rcElement && rcElement.ref) {
          if (typeof rcElement.ref === 'function') {
            rcElement.ref(node);
          } else {
            (
              rcElement.ref as React.MutableRefObject<HTMLElement | null>
            ).current = node;
          }
        }
        if (typeof props.ref === 'function') {
          props.ref(node);
        } else {
          (props.ref as React.MutableRefObject<HTMLElement | null>).current =
            node;
        }
      };

      return;
    }
    if (key === 'className') {
      newProps.className = `${props.className} ${rcElement.props.className}`;
      return;
    }
    if (key === 'style') {
      newProps.style = { ...props.style, ...rcElement.props.style };
      return;
    }
    if (key === 'children') {
      return;
    }

    newProps[key as keyof React.HTMLAttributes<HTMLElement>] = <
      T extends Array<unknown>
    >(
      ...args: T
    ) => {
      if (
        key in rcElement.props &&
        typeof rcElement.props[key as keyof typeof rcElement.props] ===
          'function'
      ) {
        rcElement.props[key as keyof typeof rcElement.props](...args);
      }
      (props[key as keyof P] as (...args: T) => unknown)(...args);
    };
  });
  return newProps;
};

export default useInheritProperty;
