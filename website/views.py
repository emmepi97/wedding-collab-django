from django.shortcuts import render
from django.http import Http404

DEMOS = [
    {
        "slug": "romantico",
        "title": "Demo Romantico",
        "subtitle": "Stile elegante, foto grandi, timeline della storia.",
    },
    {
        "slug": "minimal",
        "title": "Demo Minimal",
        "subtitle": "Pulito, moderno, perfetto per coppie essenziali.",
    },
    {
        "slug": "boho",
        "title": "Demo Boho Chic",
        "subtitle": "Palette calda, illustrazioni, vibe naturale.",
    },
    {
        "slug": "luxury",
        "title": "Demo Luxury",
        "subtitle": "Hero impact, dettagli premium, RSVP in evidenza.",
    },
    {
        "slug": "destination",
        "title": "Demo Destination Wedding",
        "subtitle": "Mappe, travel info, eventi su più giorni.",
    },
]

TEAM = [
    {"name": "Giulia", "role": "Project & Customer Success"},
    {"name": "Marco", "role": "Web Designer"},
    {"name": "Sara", "role": "Copy & Storytelling"},
]

CONTACTS = {
    "email": "hello@tuodominio.it",
    "phone": "+39 000 000 0000",
    "location": "Italia (remote)",
}

def home(request):
    context = {
        "demos": DEMOS,
    }
    return render(request, "home.html", context)

def contatti(request):
    return render(request, "contatti.html", {"team": TEAM, "contacts": CONTACTS})

def demo_list(request):
    return render(request, "demo_list.html", {"demos": DEMOS})

def demo_detail(request, slug):
    template_map = {
        "romantico": "demo_romantico.html",
        "minimal": "demo_minimal.html",
        "boho": "demo_boho.html",
        "luxury": "demo_luxury.html",
        "destination": "demo_destination.html",
    }

    demo = next((d for d in DEMOS if d["slug"] == slug), None)
    if not demo:
        raise Http404("Demo non trovata")

    template_name = template_map.get(slug)
    if not template_name:
        raise Http404("Template demo non trovato")

    return render(request, template_name, {"demo": demo})

from django.shortcuts import render

def demo_romantico(request):
    return render(request, "demo_romantico.html")
