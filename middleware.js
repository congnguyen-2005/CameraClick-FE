// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const userCookie = request.cookies.get('user_data');
  const { pathname } = request.nextUrl;

  // Nếu là Admin, cho phép đi khắp nơi (cả / và /admin)
  if (userCookie) {
    const user = JSON.parse(userCookie.value);
    if (user.roles === 'admin') {
      return NextResponse.next();
    }
  }

  // Nếu không phải admin mà cố vào /admin thì đẩy ra trang chủ
  if (pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}