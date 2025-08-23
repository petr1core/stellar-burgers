export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line no-useless-escape
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  const value = matches ? decodeURIComponent(matches[1]) : undefined;
  console.log(
    `getCookie(${name}):`,
    value ? `${value.substring(0, 20)}...` : 'undefined'
  );
  return value;
}

export function setCookie(
  name: string,
  value: string,
  props: { [key: string]: string | number | Date | boolean } = {}
) {
  console.log(
    `setCookie(${name}):`,
    value ? `${value.substring(0, 20)}...` : 'undefined'
  );
  props = {
    path: '/',
    ...props
  };

  let exp = props.expires;
  if (exp && typeof exp === 'number') {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }

  if (exp && exp instanceof Date) {
    props.expires = exp.toUTCString();
  }
  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }
  document.cookie = updatedCookie;
  console.log(
    `setCookie(${name}): cookie set:`,
    updatedCookie.substring(0, 50) + '...'
  );
}

export function deleteCookie(name: string) {
  console.log(`deleteCookie(${name})`);
  setCookie(name, '', { expires: -1 });
}
