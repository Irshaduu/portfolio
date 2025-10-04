from django.shortcuts import render



def indro (request):
    return render (request,'indro.html')

def quiz(request):
    a = request.POST['name1']
    b = int(request.POST['money'])  # Convert to integer
    
    if b <= 1000:  # Now compare as numbers
        return render(request, 'ban.html', {'money': b, 'name1': a})
    else:
        return render(request, 'quiz.html', {'money': b, 'name1': a})
            
def ban (request):
    return render (request,'ban.html')

def notreal (request):
    return render (request,'notreal.html')

def terms (request):
    return render (request,'terms.html')

def quiz1 (request):
    return render (request,'quiz1.html')

def quiz2 (request):
    return render (request,'quiz2.html')

def wrong (request):
    return render (request,'wrong.html')

def quiz3 (request):
    return render (request,'quiz3.html')

def resume (request):
    return render (request,'resume.html')

def gandhi (request):
    return render (request,'gandhi.html')

def mandela (request):
    return render (request,'mandela.html')

def truman (request):
    return render (request,'truman.html')

def hitler (request):
    return render (request,'hitler.html')

def stalin (request):
    return render (request,'stalin.html')

def elizabeth (request):
    return render (request,'elizabeth.html')

def donate (request):
    return render (request,'donate.html')



    
    


