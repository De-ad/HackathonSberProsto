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
            "meterPrice": [20, 2000],
            "floor": [1, 30]
        })


@front_router.get("/categories", response_model=list[CategoryResponse])
async def getAllCategories():
    return [CategoryResponse(id=id_, title=str(title)) for id_, title in enumerate(open("./queries.txt", "r").readlines())]


@front_router.post("/suggest-categories", response_model=list[list[CategoryResponse]])
def suggestCategoriesGoodAndBad(preFlightRequest: PreFlightRequest):
    return [
        [
            CategoryResponse(id=1, title="Кафе"), CategoryResponse(id=2, title="Морг")
        ],
        [
            CategoryResponse(id=3, title="Bad Category 1"), CategoryResponse(id=3, title="Bad Category 2")
        ]
    ]


@front_router.post("/full-suggest", response_model=list[FullMapResponse])
def suggestFullPlace(fullBusinessPlaceRequest: FullBusinessPlaceRequest):
    return [
        FullMapResponse(
            id=1,
            lat=50.0,
            lon=50.0,
            link="example link",
            saturationCoef=0.8,
            address="address",
            label="торговые",
            businesses=[
                BusinessResponse(id=123, title="business", rating=4.4, reviewCount=150, address="spb",
                                 categoryTitle="клиника", categoryId="228")
            ]
        )]


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
    return [{"id": metro.index(m), "title": "ст. м. " + m} for m in metro]
