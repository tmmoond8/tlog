import fetch from 'node-fetch';

export default async function handler(req, res) {
  const data = await (
    await fetch('https://api.picar.kr/api/article/list')
  ).json();
  res.status(200).json(data);
}
