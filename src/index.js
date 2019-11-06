// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finished loading. 
const mainUrl = ('http://localhost:3500/quotes?_embed=likes')
const likeUrl = ('http://localhost:3500/likes/')
const quotesUrl = ('http://localhost:3500/quotes')


document.addEventListener('DOMContentLoaded', function(){
    getQuotes()
    

    function getQuotes(){
        return fetch(mainUrl)
        .then(response => response.json())
        .then(quotes => renderQuotes(quotes))
    }

    function renderQuotes(quotes){
        quotes.forEach(function(quote){ 
            renderQuote(quote)
        })
    }

    function renderQuote(quote){ 
        const quoteList = document.querySelector('#quote-list')
        let li = document.createElement('li')
        li.className = 'quote-card'

        let blockQuote = document.createElement('blockquote')
        blockQuote.className = 'blockquote'

        let p = document.createElement('p')
        p.innerText = quote.quote


        let footer = document.createElement('footer')
        footer.className = 'blockquote-footer'
        footer.innerHTML = quote.author


        let likeBtn = document.createElement('button')
        likeBtn.className = 'btn-success'
        likeBtn.innerText = 'Like'
        likeBtn.id = quote.id 


        let delBtn = document.createElement('button')
        delBtn.className = 'btn-danger'
        delBtn.innerText = 'Delete'
        delBtn.id = quote.id
                    
        
        let numOfLikes = document.createElement('button')
        numOfLikes.innerText = quote.likes && quote.likes.length || 0
        numOfLikes.id = quote.id
        numOfLikes.className = "liker"

        quoteList.append(li,blockQuote)
        li.append(p,footer,likeBtn, delBtn, numOfLikes)

        likeBtn.addEventListener('click', likes)
        delBtn.addEventListener('click', destroy)

    }


    const form = document.querySelector('#new-quote-form')
    form.addEventListener('submit', function(e){
        e.preventDefault()

        const newPost = {
            quote:document.querySelector('#new-quote').value,
            author: document.querySelector('#author').value
        }

        createNewPost(newPost)
        .then(post => renderQuote(post))

    })

    function createNewPost(newPost){
        let configurationObject ={ 
            method : 'POST', 
            headers: {
                'Content-Type':'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newPost)
        }
        return fetch(mainUrl, configurationObject)
        .then(response => response.json())
    } 

    function likes(e){
        const liked = e.target.parentElement.querySelector('.liker')
        // let like = (document.querySelector('.btn-success'))
        // like.innerText = parseInt(e.target.value) + 1
        
        const newLike = { 
                    
            quoteId: parseInt(e.target.id),
            createdAt: Date.now()
        }

        postLike(newLike)
        .then(function(like){
            
            liked.innerText = parseInt(liked.innerText)+ 1

        })
    }
   
    function postLike(newLike){
        let configurationObject = { 
                method: 'POST',
                headers: {
                    'Content-Type':'application/json', 
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newLike)
            }

        return fetch(likeUrl, configurationObject)
        .then(response => response.json())
   
    } 

   
    
    function destroy(e){ 
     const quoteId = e.target.id
    fetch(`${quotesUrl}/${quoteId}`, {method: "DELETE"})
    .then(response => {response.json()})
    .then(updateDestroy(e))
    }

    function updateDestroy(e){
       
        e.target.parentElement.remove()
    }
    
     
})