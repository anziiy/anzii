


export const init = function(){
  
  
  this.adLog('View has been initialised') 
  this.listens({
	  
	'config-view': this.handleConfigView.bind(this),
	'do-view-task': this.handleViewTask.bind(this)
  
  })

	
}


export const handleConfigView = function(data){

	const self = this 
	let routes = [] 
	let handlers = null

	self.pao.pa_wiLog('views data from config')
	self.pao.pa_wiLog(data)
	data instanceof Array ?  routes = data : (routes = data.routes,handlers = data.handlers)

	routes.forEach(route => {
		
		if(route.view){

			if(route.viewty){

				let handlerView = ''
				route.viewso.indexOf('/') >= 0 
					?  handlerView = route.viewso.split('/')[1]
					:  handlerView = route.viewso
			
				
				self.pao.pa_wiLog('THE VIEW HANDLER')
				self.pao.pa_wiLog(route.viewso.indexOf('/'))
				// self.pao.pa_wiLog(route.viewso.indexOf('/'))
				// self.pao.pa_wiLog(handlers[handlerView])
				self.pao.pa_wiLog(handlerView)

				if(route.viewty === 'template'){

				   if(!self.views){
					 

					(handlers && handlers[handlerView]) && typeof handlers[handlerView] === 'function'
						? self.views = {templates: [{match: route.path,tempPath: route.viewso,title: route.title || 'Html page',handler: handlers[handlerView].bind(self)}]}
						: self.views = {templates: [{match: route.path,tempPath: route.viewso,title: route.title || 'Html page'}]}

				   }else{

					 if(self.views.templates){

						(handlers && handlers[handlerView]) && typeof handlers[handlerView] === 'function'
							? self.views.templates.push({match: route.path,tempPath: route.viewso,title: route.title || 'Html page',handler: handlers[handlerView].bind(self)})
							: self.views.templates.push({match: route.path,tempPath: route.viewso,title: route.title || 'Html page'})
						

					 }else{

						(handlers && handlers[handlerView]) && typeof handlers[handlerView] === 'function'
							? self.views['templates'] = [{match: route.path,tempPath: route.viewso,title: route.title || 'Html page',handler: handlers[handlerView].bind(self)}]
							: self.views['templates'] = [{match: route.path,tempPath: route.viewso,title: route.title || 'Html page'}]
						 
					 }

				   }
				}else{

						if(!self.views){
					 
							self.views = {modular: [{match: route.path,vHandler: route.viewso, title: route.title}]}
	
					    }else{
	
							if(self.views.modular){
								self.views.modular.push({match: route.path,vHandler: route.viewso, title: route.title})
							}else{
								self.views['modular'] = [{match: route.path,vHandler: route.viewso, title: route.title}]
							}
		
					   }

				}

			}else{

				if(!self.views){
					 
					self.views = {modular: [{match: route.path,vHandler: route.viewso, title: route.title}]}

					}else{

					 if(self.views.modular){
						 self.views.modular.push({match: route.path,vHandler: route.viewso, title: route.title})
					 }else{
						 self.views['modular'] = [{match: route.path,vHandler: route.viewso, title: route.title}]
					 }

				}

			}
		}

	});


}

export const handleViewTask = async function(data){

	
	const self = this 
	const {payload} = data 
	const {parsed} = payload 
	const {user} = payload
	const view = parsed.derivedUrl || parsed.url

	self.pao.pa_wiLog('THE VIEW DATA')
	self.pao.pa_wiLog(data) 
	self.infoSync('HANDLING VIEW TASK')
	
	self.callback = data.callback
	let checkViewStatus = self.checkViewType(view) 

	if(checkViewStatus){

		if(checkViewStatus.type === 'template'){

			self.pao.pa_wiLog('about to render template view')
			
			if(self.validView.handler){

				let viewData = await self.validView.handler(user) 

				viewData.title = self.validView.title

				return self.callback(null,{data: {type: 'template',view:self.validView.tempPath,viewData: viewData}},'renderView')

			}else{

				return self.callback(null,{data: {type: 'template',view:self.validView.tempPath,title: self.validView.title}},'renderView')

			}
			

		}else if(checkViewStatus.type === 'modular'){

			return self.emit({type: `handle-${self.validView.vHandler}-view`,data: {view: self.validView,payload:payload,callback: self.viewHandler.bind(self),
			
				} })

		}

	}else{

		return self.callback(null,{method: 'renderView',data: false})
	}
	
	// if(view(data.req.originalUrl)) return self.emit({type: `handle-${self.requestData.handler}-view`,data: {payload:self.requestData,callback: self.taskerHandler.bind(self),
			
	// } })

} 

export const checkViewType = function(view){

	
	const self = this 
	let views = self.views

	self.pao.pa_wiLog('CHECKVIEWTYPE')
	self.pao.pa_wiLog(views)

	if(!views) return null
	if(views.templates) if(self.isTemplateView(views.templates,view)) return {type: 'template'}
	if(views.modular) if(self.isModularView(views.modular,view)) return {type: 'modular'}
	
	return null
	
	 			


	

	// if(view(data.req.originalUrl)) return self.emit({type: `handle-${self.requestData.handler}-view`,data: {payload:self.requestData,callback: self.taskerHandler.bind(self),
			
	// } })

} 


export const isTemplateView = function(views,view){

	
	const self = this 

	let isValidView = views.filter((vu,i)=> vu.match === view) 
	self.pao.pa_wiLog('ISVALID AS FILTERED')
	self.pao.pa_wiLog(isValidView)

	if(isValidView && isValidView.length === 1){
		self.validView = isValidView[0]
		return true
	}else{

		return false
	}
	

	

} 


export const isModularView = function(views,view){

	
	const self = this 
	self.pao.pa_wiLog('THE VIEWS IN MODULAR')
	self.pao.pa_wiLog(views)
	self.pao.pa_wiLog(view)

	let isValidView = views.filter((vu,i)=> vu.match === view) 
	self.wiLog()

	if(isValidView && isValidView.length === 1){
		self.validView = isValidView[0]
		return true
	}else{

		return false
	}
	
	

} 



export const viewHandler = function(err=null,data=null){
	
	
	const self = this 
	let pao = self.pao
	
	if(err){

		return self.callback({message:`There was an error handling ${self.validView.vHandler} view`},'renderView')
	}else{

		return self.callback(null,{data: {type: 'modular',view: data}},'renderView')
	
		
	}

}