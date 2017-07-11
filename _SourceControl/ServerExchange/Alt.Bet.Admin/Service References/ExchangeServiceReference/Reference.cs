﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.36301
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace AltBet.Admin.ExchangeServiceReference {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="ExchangeServiceReference.IExchangeManager")]
    public interface IExchangeManager {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/GetAllSymbolsAndOrders", ReplyAction="http://tempuri.org/IExchangeManager/GetAllSymbolsAndOrdersResponse")]
        AltBet.Exchange.AllSymbolsAndOrders[] GetAllSymbolsAndOrders(string sort, string path);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/GetAllSymbolsAndOrders", ReplyAction="http://tempuri.org/IExchangeManager/GetAllSymbolsAndOrdersResponse")]
        System.Threading.Tasks.Task<AltBet.Exchange.AllSymbolsAndOrders[]> GetAllSymbolsAndOrdersAsync(string sort, string path);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/GetExchanges", ReplyAction="http://tempuri.org/IExchangeManager/GetExchangesResponse")]
        AltBet.Exchange.AdminExchange[] GetExchanges();
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/GetExchanges", ReplyAction="http://tempuri.org/IExchangeManager/GetExchangesResponse")]
        System.Threading.Tasks.Task<AltBet.Exchange.AdminExchange[]> GetExchangesAsync();
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/CreateExchange", ReplyAction="http://tempuri.org/IExchangeManager/CreateExchangeResponse")]
        string CreateExchange(AltBet.Exchange.AddExchangeRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/CreateExchange", ReplyAction="http://tempuri.org/IExchangeManager/CreateExchangeResponse")]
        System.Threading.Tasks.Task<string> CreateExchangeAsync(AltBet.Exchange.AddExchangeRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/EditExchange", ReplyAction="http://tempuri.org/IExchangeManager/EditExchangeResponse")]
        string EditExchange(AltBet.Exchange.EditExchangeRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/EditExchange", ReplyAction="http://tempuri.org/IExchangeManager/EditExchangeResponse")]
        System.Threading.Tasks.Task<string> EditExchangeAsync(AltBet.Exchange.EditExchangeRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/DeleteExchange", ReplyAction="http://tempuri.org/IExchangeManager/DeleteExchangeResponse")]
        string DeleteExchange(string exchange);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/DeleteExchange", ReplyAction="http://tempuri.org/IExchangeManager/DeleteExchangeResponse")]
        System.Threading.Tasks.Task<string> DeleteExchangeAsync(string exchange);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/ChangeStatus", ReplyAction="http://tempuri.org/IExchangeManager/ChangeStatusResponse")]
        string ChangeStatus(AltBet.Exchange.StatusExchangeRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/ChangeStatus", ReplyAction="http://tempuri.org/IExchangeManager/ChangeStatusResponse")]
        System.Threading.Tasks.Task<string> ChangeStatusAsync(AltBet.Exchange.StatusExchangeRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/CloseExchange", ReplyAction="http://tempuri.org/IExchangeManager/CloseExchangeResponse")]
        string CloseExchange(AltBet.Exchange.CloseExchangeRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/CloseExchange", ReplyAction="http://tempuri.org/IExchangeManager/CloseExchangeResponse")]
        System.Threading.Tasks.Task<string> CloseExchangeAsync(AltBet.Exchange.CloseExchangeRequest request);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/GetSymbolAndOrdersByUrl", ReplyAction="http://tempuri.org/IExchangeManager/GetSymbolAndOrdersByUrlResponse")]
        AltBet.Exchange.AllSymbolsAndOrders GetSymbolAndOrdersByUrl(AltBet.Exchange.GetSymbolsAndOrdersByUrlRequest request, string sort);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/GetSymbolAndOrdersByUrl", ReplyAction="http://tempuri.org/IExchangeManager/GetSymbolAndOrdersByUrlResponse")]
        System.Threading.Tasks.Task<AltBet.Exchange.AllSymbolsAndOrders> GetSymbolAndOrdersByUrlAsync(AltBet.Exchange.GetSymbolsAndOrdersByUrlRequest request, string sort);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/GetSortExchanges", ReplyAction="http://tempuri.org/IExchangeManager/GetSortExchangesResponse")]
        AltBet.Exchange.AdminExchange[] GetSortExchanges(string sortBy, System.Nullable<AltBet.Exchange.StatusEvent> status);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/GetSortExchanges", ReplyAction="http://tempuri.org/IExchangeManager/GetSortExchangesResponse")]
        System.Threading.Tasks.Task<AltBet.Exchange.AdminExchange[]> GetSortExchangesAsync(string sortBy, System.Nullable<AltBet.Exchange.StatusEvent> status);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/GetItemsOnPage", ReplyAction="http://tempuri.org/IExchangeManager/GetItemsOnPageResponse")]
        int GetItemsOnPage();
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IExchangeManager/GetItemsOnPage", ReplyAction="http://tempuri.org/IExchangeManager/GetItemsOnPageResponse")]
        System.Threading.Tasks.Task<int> GetItemsOnPageAsync();
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IExchangeManagerChannel : AltBet.Admin.ExchangeServiceReference.IExchangeManager, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class ExchangeManagerClient : System.ServiceModel.ClientBase<AltBet.Admin.ExchangeServiceReference.IExchangeManager>, AltBet.Admin.ExchangeServiceReference.IExchangeManager {
        
        public ExchangeManagerClient() {
        }
        
        public ExchangeManagerClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public ExchangeManagerClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public ExchangeManagerClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public ExchangeManagerClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public AltBet.Exchange.AllSymbolsAndOrders[] GetAllSymbolsAndOrders(string sort, string path) {
            return base.Channel.GetAllSymbolsAndOrders(sort, path);
        }
        
        public System.Threading.Tasks.Task<AltBet.Exchange.AllSymbolsAndOrders[]> GetAllSymbolsAndOrdersAsync(string sort, string path) {
            return base.Channel.GetAllSymbolsAndOrdersAsync(sort, path);
        }
        
        public AltBet.Exchange.AdminExchange[] GetExchanges() {
            return base.Channel.GetExchanges();
        }
        
        public System.Threading.Tasks.Task<AltBet.Exchange.AdminExchange[]> GetExchangesAsync() {
            return base.Channel.GetExchangesAsync();
        }
        
        public string CreateExchange(AltBet.Exchange.AddExchangeRequest request) {
            return base.Channel.CreateExchange(request);
        }
        
        public System.Threading.Tasks.Task<string> CreateExchangeAsync(AltBet.Exchange.AddExchangeRequest request) {
            return base.Channel.CreateExchangeAsync(request);
        }
        
        public string EditExchange(AltBet.Exchange.EditExchangeRequest request) {
            return base.Channel.EditExchange(request);
        }
        
        public System.Threading.Tasks.Task<string> EditExchangeAsync(AltBet.Exchange.EditExchangeRequest request) {
            return base.Channel.EditExchangeAsync(request);
        }
        
        public string DeleteExchange(string exchange) {
            return base.Channel.DeleteExchange(exchange);
        }
        
        public System.Threading.Tasks.Task<string> DeleteExchangeAsync(string exchange) {
            return base.Channel.DeleteExchangeAsync(exchange);
        }
        
        public string ChangeStatus(AltBet.Exchange.StatusExchangeRequest request) {
            return base.Channel.ChangeStatus(request);
        }
        
        public System.Threading.Tasks.Task<string> ChangeStatusAsync(AltBet.Exchange.StatusExchangeRequest request) {
            return base.Channel.ChangeStatusAsync(request);
        }
        
        public string CloseExchange(AltBet.Exchange.CloseExchangeRequest request) {
            return base.Channel.CloseExchange(request);
        }
        
        public System.Threading.Tasks.Task<string> CloseExchangeAsync(AltBet.Exchange.CloseExchangeRequest request) {
            return base.Channel.CloseExchangeAsync(request);
        }
        
        public AltBet.Exchange.AllSymbolsAndOrders GetSymbolAndOrdersByUrl(AltBet.Exchange.GetSymbolsAndOrdersByUrlRequest request, string sort) {
            return base.Channel.GetSymbolAndOrdersByUrl(request, sort);
        }
        
        public System.Threading.Tasks.Task<AltBet.Exchange.AllSymbolsAndOrders> GetSymbolAndOrdersByUrlAsync(AltBet.Exchange.GetSymbolsAndOrdersByUrlRequest request, string sort) {
            return base.Channel.GetSymbolAndOrdersByUrlAsync(request, sort);
        }
        
        public AltBet.Exchange.AdminExchange[] GetSortExchanges(string sortBy, System.Nullable<AltBet.Exchange.StatusEvent> status) {
            return base.Channel.GetSortExchanges(sortBy, status);
        }
        
        public System.Threading.Tasks.Task<AltBet.Exchange.AdminExchange[]> GetSortExchangesAsync(string sortBy, System.Nullable<AltBet.Exchange.StatusEvent> status) {
            return base.Channel.GetSortExchangesAsync(sortBy, status);
        }
        
        public int GetItemsOnPage() {
            return base.Channel.GetItemsOnPage();
        }
        
        public System.Threading.Tasks.Task<int> GetItemsOnPageAsync() {
            return base.Channel.GetItemsOnPageAsync();
        }
    }
}
