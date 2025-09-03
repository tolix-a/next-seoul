import React from "react";
import axios from "axios";

var convert = require("xml-js");


export function xmlTOjson(axiosResult) {
  const jsonGenre = convert.xml2json(axiosResult, { compact: true, spaces: 4 });
  let dataGenre = JSON.parse(jsonGenre).dbs.db;
  return dataGenre;
}

export const fn = {
  main: async () => {
    try{
      let res = await axios.get(`/api/api?type=apiMain`);
      return res.data;
    } catch (err){
      throw err;
    }
  },

  genre: async (shcate, cpage) => {
    try{
      let res = await axios.get(
      `/api/api?type=apiGenre&shcate=${shcate}&cpage=${cpage}`
      , { headers: { 'Cache-Control': 'no-cache' } }
      );
      return res.data;
    } catch (err){
      throw err;
    }
  },

  thisWeek: async (shcate, cpage) => {
    try{
      let res = await axios.get(
        `/api/api?type=apiThisWeek&shcate=${shcate}&cpage=${cpage}`
        , { headers: { 'Cache-Control': 'no-cache' } }
      );
      return res.data;
    } catch (err){
      throw err;
    }
  },

  ing: async (shcate, cpage) => {
    try{
      let res = await axios.get(
        `/api/api?type=apiIng&shcate=${shcate}&cpage=${cpage}`
        , { headers: { 'Cache-Control': 'no-cache' } }
      );
      return res.data;
    } catch (err){
      throw err;
    }
  },

  upcoming: async (shcate, cpage) => {
    try{
      let res = await axios.get(
        `/api/api?type=apiUpcoming&shcate=${shcate}&cpage=${cpage}`
        , { headers: { 'Cache-Control': 'no-cache' } }
      );
      return res.data;
    } catch (err){
      throw err;
    }
  },

  search: async (searchWord, page) => {
    try{
      let res = await axios.get(
        `/api/api?type=apiSearch&searchWord=${searchWord}&cpage=${page}`
        , { headers: { 'Cache-Control': 'no-cache' } }
      );
      return res.data;
    } catch (err){
      throw err;
    }
  },

  detail: async (mt20id) => {
    try{
      let res = await axios.get(`/api/api?type=apiDetail&mt20id=${mt20id}`
        , { headers: { 'Cache-Control': 'no-cache' } }
      );
      return res.data;
    } catch (err){
      throw err;
    }
  },
};