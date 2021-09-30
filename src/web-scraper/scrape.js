import 'core-js/stable';
import 'regenerator-runtime/runtime';
import fs from 'fs';
import { DateTime } from 'luxon';
import * as cheerio from 'cheerio';

import axios from './axios';

const getTopAnimes = async () => {
  const { data } = await axios('/topanime.php');
  const $ = cheerio.load(data);
  const rows = $('table.top-ranking-table tr.ranking-list');

  return rows.map(function() {
    const el = $(this);
    
    const rank = Number(el.find('td:first-child').text().trim());
    const score = Number(el.find('td.score').text().trim());
    const url = el.find('td.title a').attr('href');
    const image = el.find('td.title img').attr('data-src');
    const title = el.find('td.title .detail h3 a').text().trim();

    const info = el.find('td.title .detail .information').text().split('\n').map(line => line.trim()).filter(line => !!line);
    const typeInfo = info[0].match(/(\w+)\s\((\d+)\s\w+\)/i);
    const dates = info[1].split(' - ').map(date => DateTime.fromFormat(date, 'LLL yyyy').toISODate());
    const members = Number(info[2].replaceAll(',', '').split(' ')[0]);

    return {
      title,
      rank,
      score,
      url,
      image,
      info: {
        type: typeInfo[1],
        episodes: Number(typeInfo[2]),
        startDate: dates[0],
        endDate: dates[1],
        members
      }
    };
  }).toArray();
};

(async () => {
  const topAnimes = await getTopAnimes();
  fs.writeFileSync('./top-animes.json', JSON.stringify(topAnimes, null, 2));
})();