import random
from cmath import sin, asin, sqrt, cos
from math import radians
from typing import Optional

import numpy as np
import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel


front_router = APIRouter(
    prefix="/business",
    tags=["business"],
)


class CategoryResponse(BaseModel):
    id: int
    title: str


class InitParamsResponse(BaseModel):
    suggestions: dict[str, list[int]]


class ListCategoryResponse(BaseModel):
    categories: list[CategoryResponse]


class BusinessResponse(BaseModel):
    id: int
    title: str
    rating: float
    reviewCount: int
    address: str
    categoryTitle: str
    categoryId: str


class FullMapResponse(BaseModel):
    id: int
    lat: float
    lon: float
    link: str
    saturationCoef: float
    address: str
    label: str
    businesses: list[BusinessResponse]


class CategoryRequest(BaseModel):
    id: int
    title: str


class PreFlightRequest(BaseModel):
    businessCategories: list[CategoryRequest]


class Metro(BaseModel):
    id: int
    title: str


def contains_title_in_rubrics(array_of_rubrics, target_category):
    return np.array(list(map(lambda x: any([y in eval(x) for y in target_category]), array_of_rubrics)))

# ручка всех метро
class FullBusinessPlaceRequest(BaseModel):
    meterPrice: list[int]
    businessCategories: list[CategoryResponse]
    area: list[int]
    floor: list[int]
    businessNearInclude: list[CategoryResponse]
    businessNearInclude: list[CategoryResponse]
    metroStations: Metro


@front_router.get("/params", response_model=InitParamsResponse)
async def getInitChoosableData():
    return InitParamsResponse(
        suggestions={
            "area": [10, 1000],
            "meterPrice": [20, 2000000],
            "floor": [1, 30]
        })


@front_router.get("/categories", response_model=list[CategoryResponse])
async def getAllCategories():
    return [CategoryResponse(id=id_, title=str(title).strip()) for id_, title in enumerate(open("./queries.txt", "r").readlines())]


@front_router.post("/suggest-categories", response_model=list[list[CategoryResponse]])
def suggestCategoriesGoodAndBad(preFlightRequest: PreFlightRequest):
    df = pd.read_csv('/Users/dead./PycharmProjects/pythonProject6/data/fin.csv')
    poi_all = pd.read_csv('/Users/dead./PycharmProjects/pythonProject6/data/poi_new_near_less_4000.csv', delimiter='|')
    poi = pd.read_csv('/Users/dead./PycharmProjects/pythonProject6/data/poi_new_near_less_4000.csv', delimiter='|')

    cat_cnt = {}
    for index, row in poi_all.iterrows():
        rubrics = eval(row.rubrics)
        for category in rubrics:
            if category not in cat_cnt:
                cat_cnt[category] = 0
            cat_cnt[category] += 1

    poi_all = poi.copy()
    poi = poi[contains_title_in_rubrics(poi['rubrics'], list(map(lambda hh: hh.title, preFlightRequest.businessCategories)))]
    print(poi.shape)
    categories_weights = {}
    for i, v in poi.iterrows():
        nearest = eval(v['nearest'])
        nearest_df = poi_all[poi_all['id'].isin(list(map(lambda x: x[0], nearest)))]
        for s in nearest:
            target = nearest_df[nearest_df['id'] == s[0]].iloc[0]['rubrics']
            categories = eval(target)
            for category in categories:
                if category not in categories_weights:
                    categories_weights[category] = 0
                categories_weights[category] += 1 / s[1] / cat_cnt[category] ** 0.7

    weights = {k: v for k, v in reversed(list(sorted(categories_weights.items(), key=lambda item: item[1])))}

    answer = []
    for i, v in weights.items():
        answer.append(CategoryResponse(id=1, title=i))

    return [
        answer[0:5],
        [
            CategoryResponse(id=3, title="Bad Category 1"), CategoryResponse(id=3, title="Bad Category 2")
        ]
    ]
    # except :
    #     return [[],[]]



@front_router.post("/full-suggest", response_model=list[FullMapResponse])
def suggestFullPlace(fullBusinessPlaceRequest: FullBusinessPlaceRequest):
    df = pd.read_csv('/Users/dead./PycharmProjects/pythonProject6/data/fin.csv')
    poi = pd.read_csv('/Users/dead./PycharmProjects/pythonProject6/data/poi_new_near_less_4000.csv', delimiter='|')

    def filter_by_price(df, min_price, max_price):
        d = df[(df['lease_price'] >= min_price) & (df['lease_price'] <= max_price)]
        return d

    def filter_by_area(df, min_area, max_area):
        d = df[(df['total_area'] >= min_area) & (df['total_area'] <= max_area)]
        return d

    def filter_by_floor(df, min_floor, max_floor):
        d = df[(df['floor'] >= min_floor) & (df['floor'] <= max_floor)]
        return d

    def filter_by_metro(df, station):
        d = df[(df['metro_1'] == station) | (df['metro_2'] == station) | (df['metro_3'] == station)]
        return d

    def simple(lat1, lon1, lat2, lon2):
        return (((lat1 - lat2) * 111195) ** 2 + ((lon1 - lon2) * 55603) ** 2) ** 0.5

    print(fullBusinessPlaceRequest.metroStations.title)
    if fullBusinessPlaceRequest.metroStations:
        df = filter_by_metro(df, fullBusinessPlaceRequest.metroStations.title)
    df = filter_by_floor(df, *fullBusinessPlaceRequest.floor)
    df = filter_by_price(df, *fullBusinessPlaceRequest.meterPrice)
    df = filter_by_area(df, *fullBusinessPlaceRequest.area)

    points = []

    poi = poi[contains_title_in_rubrics(poi['rubrics'],
                                        list(map(lambda hh: hh.title, fullBusinessPlaceRequest.businessNearInclude)))]

    print(df.shape)
    # for category in list(map(lambda x: x.title, fullBusinessPlaceRequest.businessNearInclude)):
    for i, ad in df.iterrows():
        # print(i, poi.shape)
        good_shops = []
        for j, shop in poi.iterrows():
            if int(simple(shop['lat'], shop['lon'], ad['point_y'], ad['point_x'])) < 400:
                good_shops.append(shop)

        def f(a, b, c):
            a_n = 0.008 * 1 / (a / 2000)
            b_n = 0.6 * (b / 5) ** 6
            c_n = 0.1 * c / 150
            res = a_n + b_n + c_n
            if res > 1:
                return 1
            elif res < 0:
                return 0
            return res

        if len(good_shops) >= 4:
            s = 0
            for x in good_shops:
                s += f(simple(x['lat'], x['lon'], ad['point_y'], ad['point_x']), x['review_point'], x['review_count'])
            s /= len(good_shops)

            points.append(FullMapResponse(
                id=1,
                lat=ad['point_y'],
                lon=ad['point_x'],
                link=ad['additional_info'],
                saturationCoef=s * random.random(),
                address=ad['address'],
                label=ad['segment_type'],
                businesses=list(map(lambda x: BusinessResponse(
                    id=123,
                    title=x['name'], rating=x['review_point'], reviewCount=x['review_count'], address=x['address_name'],
                    categoryTitle=', '.join(list(map(str, eval(x['rubrics'])))), categoryId="228"
                ), good_shops))
            ))

    return list(reversed(list(sorted(points, key=lambda x: x.saturationCoef))))[0:20]


@front_router.get("/metro-stations")
def getMetroStations() -> list[dict]:
    metro = ['Гостиный Двор', 'Площадь Восстания', 'Невский Проспект', 'Владимирская', 'Маяковская', 'Достоевская',
             'Сенная Площадь', 'Звенигородская', 'Спасская', 'Садовая', 'Пушкинская', 'Чернышевская',
             'Лиговский Проспект', 'Обводный Канал', 'Технологический Институт', 'Площадь Ленина', 'Горьковская',
             'Площадь Александра Невского II', 'Площадь Александра Невского I', 'Фрунзенская', 'Спортивная',
             'Балтийская', 'Петроградская', 'Чкаловская', 'Выборгская', 'Волковская', 'Московские Ворота',
             'Крестовский Остров', 'Старая Деревня', 'Чёрная Речка', 'Пионерская', 'Василеостровская',
             'Комендантский Проспект', 'Удельная', 'Озерки', 'Парнас', 'Проспект Просвещения', 'Гражданский Проспект',
             'Девяткино', 'Площадь Мужества', 'Академическая', 'Политехническая', 'Ладожская', 'Новочеркасская',
             'Улица Дыбенко', 'Проспект Большевиков', 'Елизаровская', 'Ломоносовская', 'Пролетарская', 'Обухово',
             'Купчино', 'Рыбацкое', 'Звёздная', 'Московская', 'Парк Победы', 'Электросила', 'Проспект Ветеранов',
             'Ленинский Проспект', 'Автово', 'Кировский Завод', 'Нарвская', 'Приморская', 'Лесная']
    return [{"id": metro.index(m), "title": "" + m} for m in metro]
