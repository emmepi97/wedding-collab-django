


from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("contatti/", views.contatti, name="contatti"),

    # lista demo (se la usi ancora)
    path("demo/", views.demo_list, name="demo_list"),

    # demo pubblica diretta (NUOVA)
    path("demo/romantico/", views.demo_romantico, name="demo_romantico"),

        # demo pubblica diretta (NUOVA)
    path("demo/choco/", views.demo_romantico, name="demo_choco"),

    # dettaglio demo via slug (se lo usi)
    path("demo/<slug:slug>/", views.demo_detail, name="demo_detail"),
]



