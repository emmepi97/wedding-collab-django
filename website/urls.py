


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

        # demo pubblica diretta (NUOVA)
    path("demo/choco/", views.demo_romantico, name="demo_choco"),

            # demo pubblica diretta (NUOVA)
    path("demo2/", views.demo2, name="demo2"),

                # demo pubblica diretta (NUOVA)
    path("demo3/", views.demo3, name="demo3"),

                # demo pubblica diretta (NUOVA)
    path("demo4/", views.demo4, name="demo4"),

                    # demo pubblica diretta (NUOVA)
    path("demo5/", views.demo5, name="demo5"),
                    # demo pubblica diretta (NUOVA)
    path("demo6/", views.demo6, name="demo6"),


                     # demo pubblica diretta (NUOVA)
    path("demo7/", views.demo7, name="demo7"),


                     # demo pubblica diretta (NUOVA)
    path("demo8/", views.demo8, name="demo8"),


                         # demo pubblica diretta (NUOVA)
    path("demo/minimal/", views.demominimal, name="demominimal"),

                         # demo pubblica diretta (NUOVA)
    path("demo/luxury/", views.demoluxury, name="demoluxury"),

]



